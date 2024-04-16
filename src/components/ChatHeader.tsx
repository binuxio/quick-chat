import React, { FocusEvent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from '@/redux/store.ts'
import { ChangeEvent } from 'react';
import { validatePartnerID } from "@/data-traffic/_socket.ts"
import LoadingSpinner from "./UI/LoadingSpinner.tsx"
import { setPartnerID } from "@/redux/slices/user.ts";

const ChatHeader: React.FC = () => {
    return (
        <header className='bg-sky-200 inline-flex justify-between w-full items-center px-4 py-2'>
            <div className="flex items-center gap-x-2">
                <img src="/assets/chat.png" className="h-8" alt="logo" />
                <h1 className='text-center text-blue-950 font-semibold hidden sm:block'>Quick P2P Chat</h1>
            </div>
            <UsersConnection />
        </header>
    )
}

export default React.memo(ChatHeader)

const UsersConnection: React.FC = () => {
    return (<div className="flex gap-x-4">
        <YourID />
        <PartnerID />
    </div>)
}

const YourID: React.FC = () => {
    const { userID } = useSelector((state: RootState) => state.user.userData)
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