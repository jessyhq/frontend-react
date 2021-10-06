// Packages:
import React, { useState, useCallback, useEffect } from 'react'
import useOuterContextMenu from '../../../hooks/use-outer-context-menu'
import { useDispatch, useSelector } from 'react-redux'
import { useInput } from '../../../hooks/use-input'
import { customSplice } from '../../../util/customSplice'
import isUrl from 'is-url'
import { playButtonPress } from '../../../util/soundEffects'
import { useInterval } from 'react-use'


// Typescript:
import { IState } from '../../../redux/reducers/types'


// Imports:
import { MdPowerSettingsNew, MdPlayArrow } from 'react-icons/md'
import { RiSpotifyFill, RiAppleFill, RiSoundcloudFill } from 'react-icons/ri'


// Constants:
import { PLAYER_TYPE } from '../../../constants/extensions/Music'
import { TIME } from '../../../constants'
import { IObjectStoreExtensionMusic } from '../../../indexedDB/types'
import { OBJECT_STORE, OBJECT_STORE_EXTENSION_IDS } from '../../../constants/indexedDB/objectStores'


// Redux:
import { updateContextTarget, updateObjectStore } from '../../../redux/actions'


// Styles:
import {
  Button,
  Knob,
  LEDLight
} from '../../global/Skeumorphic'

import {
  ButtonArea,
  InnerContainer,
  Name,
  OuterEdge,
  Screen,
  ScreenText,
  SpeakerGrill,
  URLInput,
  Wrapper
} from './styles'


// Functions:
const Music = ({ _id }: { _id: string }) => {
  // Constants:
  const dispatch = useDispatch()

  // Ref:
  const wrapperRef = useOuterContextMenu((e) => {
    if (contextTarget[ _id ] === true) dispatch(updateContextTarget({ [_id ]: false }))
  })

  // State:
  const localMusicState = useSelector((state: IState) => state.global.localStorageDb.objectStores.extensions.music[ _id ])
  const contextTarget = useSelector((state: IState) => state.global.contextTarget)
  const [ hasLocalStateLoaded, setHasLocalStateLoaded ] = useState(false)
  const [ isOn, setIsOn ] = useState(false)
  const [ currentPlayer, setCurrentPlayer ] = useState<PLAYER_TYPE>(PLAYER_TYPE.SOUNDCLOUD)
  const { value: URLValue, bind: bindURLValue, reset: resetURLValue } = useInput('')
  const [ playerURL, setPlayerURL ] = useState({
    APPLE_MUSIC:'https://embed.music.apple.com/us/album/study-music-playlist-ultimate-studying-music-for-concentration/977417407',
    SPOTIFY: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8NTLI2TtZa6',
    SOUNDCLOUD: 'dabootlegboy/sets/study-chill-lofi-hiphop'
  })

  // Functions:
  const handleMusicURL = useCallback((URL: string) => {
    let newCurrentPlayer = undefined, newPlayerURL = undefined, newURL = undefined
    if (URL.includes('spotify.com')) {
      newCurrentPlayer = PLAYER_TYPE.SPOTIFY
      newURL = customSplice(URL, URL.search('spotify.com') + 'spotify.com'.length, 0, '/embed')
      newPlayerURL = { ...playerURL, SPOTIFY: newURL }
    } else if (URL.includes('music.apple')) {
      newCurrentPlayer = PLAYER_TYPE.APPLE_MUSIC
      newURL = customSplice(URL, URL.search('music.apple'), 0, 'embed.')
      newPlayerURL = { ...playerURL, APPLE_MUSIC: newURL }
    } else if (URL.search('https://soundcloud.com') === 0 || URL.search('https://m.soundcloud.com') === 0) {
      newCurrentPlayer = PLAYER_TYPE.SOUNDCLOUD
      newURL = URL.substring(URL.search('soundcloud.com/') + 'soundcloud.com/'.length)
      newPlayerURL = { ...playerURL, SOUNDCLOUD: newURL }
    } else {
      return
    }
    setCurrentPlayer(newCurrentPlayer)
    setPlayerURL(newPlayerURL)
    dispatch(updateObjectStore({
      [ OBJECT_STORE_EXTENSION_IDS.MUSIC ]: {
          [ _id ]: {
          ...localMusicState,
          lastMusic: {
            option: newCurrentPlayer,
            URL: ''
          },
          time: {
            ...localMusicState.time,
            lastEdited: Date.now()
          }
        }
      } as IObjectStoreExtensionMusic
    }, OBJECT_STORE.EXTENSIONS))
    resetURLValue()
  }, [ _id, dispatch, localMusicState, playerURL, resetURLValue ])

  const onPowerButtonClick = useCallback(() => {
    playButtonPress()
    if (isOn) {
      setIsOn(false)
      dispatch(updateObjectStore({
        [ OBJECT_STORE_EXTENSION_IDS.MUSIC ]: {
          [ _id ]: {
            ...localMusicState,
            isOn: false,
            time: {
              ...localMusicState.time,
              lastEdited: Date.now()
            }
          }
        } as IObjectStoreExtensionMusic
      }, OBJECT_STORE.EXTENSIONS))
    } else {
      setIsOn(true)
      dispatch(updateObjectStore({
        [ OBJECT_STORE_EXTENSION_IDS.MUSIC ]: {
          [ _id ]: {
            ...localMusicState,
            isOn: true,
            time: {
              ...localMusicState.time,
              lastEdited: Date.now()
            }
          }
        } as IObjectStoreExtensionMusic
      }, OBJECT_STORE.EXTENSIONS))
    }
  }, [ _id, dispatch, isOn, localMusicState ])

  const onMusicOption = useCallback((newPlayer: PLAYER_TYPE) => {
    if (isOn && currentPlayer !== newPlayer) {
      playButtonPress()
      setCurrentPlayer(newPlayer)
      dispatch(updateObjectStore({
        [ OBJECT_STORE_EXTENSION_IDS.MUSIC ]: {
          [ _id ]: {
            ...localMusicState,
            lastMusic: {
              ...localMusicState.lastMusic,
              option: newPlayer
            },
            time: {
              ...localMusicState.time,
              lastEdited: Date.now()
            }
          }
        } as IObjectStoreExtensionMusic,
      }, OBJECT_STORE.EXTENSIONS))
    }
  }, [ _id, currentPlayer, dispatch, isOn, localMusicState ])

  const onCustomMusicURL = useCallback(() => {
    if (isOn && URLValue.length > 0 && isUrl(URLValue)) {
      playButtonPress()
      handleMusicURL(URLValue)
    }
  }, [ URLValue, handleMusicURL, isOn ])

  // Effects:
  useEffect(() => {
    if (localMusicState && !hasLocalStateLoaded) {
      setIsOn(localMusicState.isOn)
      if (localMusicState.lastMusic.URL) handleMusicURL(localMusicState.lastMusic.URL)
      else setCurrentPlayer(localMusicState.lastMusic.option)
      setHasLocalStateLoaded(true)
    }
  }, [ handleMusicURL, hasLocalStateLoaded, localMusicState ])

  useInterval(() => {
    dispatch(updateObjectStore({
      [ OBJECT_STORE_EXTENSION_IDS.MUSIC ]: {
        [ _id ]: {
          ...localMusicState,
          time: {
            ...localMusicState.time,
            uptime: localMusicState.time.uptime + TIME.MINUTE
          }
        }
      } as IObjectStoreExtensionMusic
    }, OBJECT_STORE.EXTENSIONS))
  }, TIME.MINUTE)

  // Return:
  return (
    <Wrapper
      ref={ wrapperRef }
      onContextMenu={() => { if (!contextTarget[ _id ]) dispatch(updateContextTarget({ [ _id ]: true })) }}
    >
      <InnerContainer className='draggableCancel'>
        <Screen>
          { !isOn && <ScreenText>OFF</ScreenText> }
          { isOn && <ScreenText>LOADING..</ScreenText> }
          {
            isOn && currentPlayer === 'APPLE_MUSIC'
            &&
            <iframe
              title='apple-music-player'
              allow='autoplay *; encrypted-media *;'
              frameBorder='0'
              height='160'
              style={{ position: 'relative', zIndex: 1, height: '120px', overflow: 'hidden', background: 'transparent', borderRadius: '10px', transform: 'scale(0.88)' }}
              sandbox='allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation'
              src={ playerURL.APPLE_MUSIC }
            ></iframe>
          }
          {
            isOn && currentPlayer === 'SPOTIFY'
            &&
            <iframe
              title='spotify-player'
              src={ playerURL.SPOTIFY }
              width='260'
              height='80'
              style={{ position: 'relative', zIndex: 1, borderRadius: '10px' }}
              frameBorder='0'
              allow='encrypted-media'
            ></iframe>
          }
          {
            isOn && currentPlayer === 'SOUNDCLOUD'
            &&
            <iframe
              title='soundcloud-player'
              style={{ position: 'relative', zIndex: 1, minWidth: '430px', height: '170px', borderRadius: '10px', transform: 'scale(0.6)' }}
              scrolling='no'
              frameBorder='no'
              allow='autoplay'
              src={ `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/${ playerURL.SOUNDCLOUD }&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}>
            </iframe>
          }
        </Screen>
        <ButtonArea>
          <span>
            <Button>
              <Knob
                selected={ false }
                onClick={ onPowerButtonClick }
              >
                { !isOn ? <MdPowerSettingsNew style={{ color: 'lightseagreen' }} /> : <MdPowerSettingsNew style={{ color: 'palevioletred' }} /> }
              </Knob>
            </Button>
            <Button>
              <Knob
                selected={ currentPlayer === PLAYER_TYPE.APPLE_MUSIC || !isOn }
                onClick={ () => onMusicOption(PLAYER_TYPE.APPLE_MUSIC) }
              >
                <RiAppleFill />
              </Knob>
            </Button>
            <Button>
              <Knob
                selected={ currentPlayer === PLAYER_TYPE.SPOTIFY || !isOn }
                onClick={ () => onMusicOption(PLAYER_TYPE.SPOTIFY) }
              >
                <RiSpotifyFill />
              </Knob>
            </Button>
            <Button>
              <Knob
                selected={ currentPlayer === PLAYER_TYPE.SOUNDCLOUD || !isOn }
                onClick={ () => onMusicOption(PLAYER_TYPE.SOUNDCLOUD) }
              >
                <RiSoundcloudFill />
              </Knob>
            </Button>
          </span>
          <span>
            <Button width={ 3.15 }>
              <URLInput type='text' placeholder='https://link.to.music/' { ...bindURLValue } />
            </Button>
            <Button><Knob
              selected={ !isOn || URLValue.length === 0 || !isUrl(URLValue) }
              onClick={ onCustomMusicURL }
            ><MdPlayArrow /></Knob></Button>
          </span>
        </ButtonArea>
      </InnerContainer>
      <OuterEdge>
        <Name>MUSIC</Name>
        <LEDLight active={ isOn }></LEDLight>
        <SpeakerGrill>•••</SpeakerGrill>
      </OuterEdge>
    </Wrapper>
  )
}


// Exports:
export default Music
