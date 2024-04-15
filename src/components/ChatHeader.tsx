import React, { FocusEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '@/redux/store.ts'
import { ChangeEvent } from 'react';
import { validatePartnerID } from "@/data-traffic/_socket.ts"
import LoadingSpinner from "./UI/LoadingSpinner.tsx"
import { setPartnerID } from "@/redux/slices/user.ts";

const ChatHeader: React.FC = () => {

    return (
        <header className='bg-sky-200 inline-flex w-full items-center justify-center relative'>
            <div className='px-4'>
                <svg xmlns="http://www.w3.org/2000/svg" className='h-[1.7em]' viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                        <path d="M3005 4109 c-1094 -555 -2212 -1123 -2483 -1261 -408 -207 -495 -255
              -507 -278 -21 -42 -18 -74 9 -108 22 -25 131 -64 950 -342 l926 -313 0 -594
              c0 -543 1 -597 17 -624 20 -34 69 -53 109 -43 20 5 175 152 482 455 439 435
              454 448 480 438 184 -70 2009 -679 2035 -679 23 0 46 8 64 24 l28 24 3 2114
              c1 1464 -1 2121 -8 2139 -13 30 -58 59 -92 59 -12 0 -918 -455 -2013 -1011z
              m301 -748 l-1359 -1359 -531 180 c-292 99 -647 219 -789 266 -141 48 -257 90
              -257 93 0 7 4269 2178 4285 2178 5 1 -602 -611 -1349 -1358z m1610 -2359 c-3
              -2 -78 20 -168 50 l-163 55 -5 552 -5 553 -34 30 c-28 25 -39 29 -70 24 -23
              -3 -46 -17 -63 -36 l-28 -30 0 -511 c0 -405 -3 -510 -12 -507 -7 3 -505 171
              -1105 374 -601 203 -1093 372 -1093 376 0 4 618 627 1373 1384 l1372 1376 3
              -1842 c1 -1014 0 -1845 -2 -1848z m-2184 519 c4 -4 -136 -150 -312 -326 l-320
              -320 0 432 0 432 313 -106 c171 -58 315 -109 319 -112z" />
                        <path d="M4445 2651 c-64 -27 -81 -110 -32 -158 60 -61 162 -19 162 67 0 66-72 116 -130 91z" />
                        <path d="M884 1028 c-305 -305 -394 -400 -399 -425 -13 -66 52 -131 118 -118
              25 5 120 94 425 399 l392 392 0 43 c0 60 -41 101 -101 101 l-43 0 -392 -392z" />
                        <path d="M2977 563 c-198 -197 -372 -376 -388 -397 -39 -53 -38 -89 5 -132 43
              -43 79 -44 132 -5 21 16 200 190 397 388 l357 359 0 46 c0 63 -35 98 -98 98
              l-46 0 -359 -357z" />
                        <path d="M266 404 c-20 -21 -26 -37 -26 -69 0 -59 36 -95 95 -95 32 0 48 6 69
              26 20 21 26 37 26 69 0 59 -36 95 -95 95 -32 0 -48 -6 -69 -26z" />
                    </g>
                </svg>
            </div>
            {/* <h1 className='text-lg text-center py-3 drop-shadow-2xl text-blue-950 font-semibold'>
            Quick Data Transfer
            </h1> */}
            <UsersConnection />
            <Menu />
        </header>
    )
}

export default React.memo(ChatHeader)

const UsersConnection: React.FC = () => {
    return (<div className="mx-auto flex gap-x-4">
        <YourID />
        <PartnerID />
    </div>)
}

const YourID: React.FC = () => {
    const { userID, username } = useSelector((state: RootState) => state.user.userData)
    const [uid, setuid] = useState<undefined | number>(undefined)
    useEffect(() => { setuid(userID) })

    return (<div className="flex items-center gap-x-2">
        <span className="text-xs">Your ID:</span>
        {!uid ?
            <span className="w-10 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" height={16} width={16} viewBox="0 0 512 512" className="animate-spin">
                    <path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z" />
                </svg>
            </span>
            : <span className="mb-[1px] text-center">
                {userID?.toString().substring(0, 2) + "-" + userID?.toString().substring(2)}
            </span>}
    </div>)
}

const PartnerID: React.FC = () => {
    const inputRefs: React.RefObject<HTMLInputElement>[] = Array.from({ length: 4 }, () => useRef(null));
    const [inputNumber, setInputNumber] = useState<number | null>(null);
    const [validatingID, setValidatingID] = useState(false)
    const [idIsValid, setIdIsValid] = useState<null | boolean>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (inputNumber?.toString().length === 4) {
            setValidatingID(true);
            (async () => {
                const isValid = await validatePartnerID(inputNumber)
                setIdIsValid(isValid)
                if (isValid) {
                    dispatch(setPartnerID(inputNumber))
                    inputRefs[3].current?.blur()
                    const textInput = document.getElementById("textInput");
                    if (textInput) textInput.focus()
                    window.localStorage.setItem("lastPartnerID", inputNumber.toString())
                }
                setTimeout(() => {
                    setValidatingID(false)
                }, 100);
            })()
        } else {
            setValidatingID(false)
            setIdIsValid(null)
            dispatch(setPartnerID(null))
        }
    }, [inputNumber])

    const handleInput = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        console.log(index)
        let value = event.target.value;
        if (!/^\d*$/.test(value)) {
            event.target.value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
            return
        }
        if (value.length > 1) event.target.value = value[1]
        value = event.target.value
        if (value.length === 1 && index < inputRefs.length - 1) {
            inputRefs[index + 1].current!.focus();
        }

        if (index === 0) {
            inputRefs.forEach((inputRef, i) => {
                if (i == 0) return
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            });
        }

        const newPartnerID = inputRefs.reduce((acc, ref) => {
            return acc + (ref.current?.value);
        }, '');

        setInputNumber(newPartnerID ? parseInt(newPartnerID, 10) : null);
    };

    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
        const value = event.target.value;
        event.target.setSelectionRange(value.length, value.length);
        // event.target.style.caretColor = 'transparent';
    };

    const idVailidColor = idIsValid == null ? "" : idIsValid ? "limegreen" : "red";



    function autoInsertLastPartnerID() {
        const lastPartnerID = window.localStorage.getItem("lastPartnerID")
        if (lastPartnerID) {
            inputRefs.forEach((inp, i) => inp.current!.value = lastPartnerID[i])
            setInputNumber(parseInt(lastPartnerID))
        }
    }

    useEffect(() => {
        autoInsertLastPartnerID()
    }, [])

    return (
        <div className="flex items-center gap-x-2">
            <span className="text-xs">Partners ID:</span>
            <div className="">
                <div className="flex gap-x-1 items-center h-5 relative">
                    {inputRefs.map((ref, index) => (
                        <React.Fragment key={index}>
                            <input
                                ref={ref}
                                inputMode="numeric"
                                className="bg-sky-100 focus:!border-black outline-none w-4 h-full border-b-2 border-sky-300 pl-[3px]"
                                style={{ borderColor: idVailidColor }}
                                onChange={(e) => handleInput(index, e)}
                                onFocus={handleFocus}
                            />
                            {index == 1 && <span className="h-full grid place-items-center">
                                <div className="w-1 h-[1px] bg-black"></div>
                            </span>}
                        </React.Fragment>
                    ))}
                    {validatingID &&
                        <div className="absolute -right-6 h-4">
                            <LoadingSpinner />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

const Menu: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        function dropMenu(e: Event) {
            //@ts-ignore
            const targetID = e.target.id
            if (targetID != "dropMenuButton") setMenuOpen(false)
        }

        window.addEventListener('click', dropMenu)
        return () => {
            window.removeEventListener("click", dropMenu)
        }
    }, [])


    return (
        <nav className="">
            <button className="px-4 h-10" onClick={() => setMenuOpen(e => !e)} id="dropMenuButton">
                <svg xmlns="http://www.w3.org/2000/svg" height={18} width={5} viewBox="0 0 128 512" className="pointer-events-none">
                    <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                </svg>
            </button>
            <div className="absolute top-12 right-2 bg-white rounded-md min-w-[10rem] overflow-hidden" style={{ display: menuOpen ? "grid" : "none" }} id="dropMenu">
                <button className="leading-none px-4 py-2 hover:bg-sky-200 border-b border-gray-100">
                    <span className="mr-1">i</span>
                    Connect
                </button>
                <button className="leading-none px-4 py-2 hover:bg-sky-200 border-b border-gray-100">
                    Connect
                </button>
                <button className="leading-none px-4 py-2 hover:bg-sky-200">
                    Connect
                </button>
            </div>
        </nav>
    )
}