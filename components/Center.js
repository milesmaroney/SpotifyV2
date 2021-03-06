import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  'from-red-500',
  'from-orange-500',
  'from-yellow-500',
  'from-green-500',
  'from-blue-500',
  'from-indigo-500',
  'from-violet-500',
]

function Center() {
  const {data: session} = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then(data => setPlaylist(data.body)).catch(err => console.log('Something went wrong!', err))
  }, [spotifyApi, playlistId])

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div className="flex items-center text-white bg-black bg-opacity-70 space-x-3 hover:opacity-100 cursor-pointer rounded-full p-1 pr-2"
        onClick={signOut}>
          <img className="rounded-full object-cover h-8 w-8" src={session?.user.image} alt={session?.user.name} />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
        <img src={playlist?.images?.[0]?.url} className='h-44 w-44 shadow-2xl' />
        <div>
          <p className="text-sm">PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center;