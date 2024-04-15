import { useEffect, useState } from "react"
import "./App.css"
import ChatContainer from "./components/ChatContainer.tsx"
import initSocket, { getUserData } from "./data-traffic/_socket.ts"
import { useDispatch } from "react-redux"
import onIncommingMsg from "./data-traffic/receive/onIncommingMsg.ts"
import ChatHeader from "./components/ChatHeader.tsx"

function App() {
  const [screenHeight, setScreenHeight] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!window.socket) {
      initSocket().then(socket => {
        getUserData(dispatch)
        socket!.on("new-msg", (msgObject, callback) => {
          callback({ success: true })
          onIncommingMsg(msgObject, dispatch)
        })
      }).catch(e => {
        // TODO: Notify user of the error
        console.log(e)
      })
    }


    setScreenHeight(window.innerHeight)
    function setScreen() {
      setScreenHeight(window.visualViewport?.height!)
    }


    window.addEventListener('resize', setScreen)

    return () => {
      window.removeEventListener("resize", setScreen)
    }
  }, [])

  return (
    <>
      <main className='w-full bg-sky-100 overflow-hidden grid place-items-center md:py-10 h-screen' style={{ height: screenHeight }}>
        <div className='bg-neutral-100 md:rounded-2xl overflow-hidden shadow-xl w-full md:max-w-2xl h-full flex flex-col'>
          <ChatHeader />
          <ChatContainer />
        </div>
      </main>
    </>
  )
}

export default App
