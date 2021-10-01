// Packages:
import React, { useState, useCallback } from 'react'
import { useInput } from '../../../hooks/use-input'
import { customSplice } from '../../../util/customSplice'
import isUrl from 'is-url'
import { playButtonPress } from '../../../util/soundEffects'


// Typescript:
import { TPlayer } from './types'


// Imports:
import { MdPowerSettingsNew, MdPlayArrow } from 'react-icons/md'
import { RiSpotifyFill, RiAppleFill, RiSoundcloudFill } from 'react-icons/ri'


// Constants:
import { PLAYER_TYPE } from '../../../constants/extensions/Music'


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
const Music = () => {
  // State:
  const [ isOn, setIsOn ] = useState(true)
  const [ currentPlayer, setCurrentPlayer ] = useState<TPlayer>('SPOTIFY')
  const { value: URLValue, bind: bindURLValue, reset: resetURLValue } = useInput('')
  const [ playerURL, setPlayerURL ] = useState({
    APPLE_MUSIC:'https://embed.music.apple.com/us/album/study-music-playlist-ultimate-studying-music-for-concentration/977417407',
    SPOTIFY: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8NTLI2TtZa6',
    SOUNDCLOUD: 'dabootlegboy/sets/study-chill-lofi-hiphop'
  })

  // Functions:
  const handleMusicURL = useCallback((URL: string) => {
    if (URL.includes('spotify.com')) {
      setCurrentPlayer(PLAYER_TYPE.SPOTIFY)
      setPlayerURL({ ...playerURL, SPOTIFY: customSplice(URL, URL.search('spotify.com') + 'spotify.com'.length, 0, '/embed') })
    } else if (URL.includes('music.apple')) {
      setCurrentPlayer(PLAYER_TYPE.APPLE_MUSIC)
      setPlayerURL({ ...playerURL, APPLE_MUSIC: customSplice(URL, URL.search('music.apple'), 0, 'embed.') })
    } else if (URL.search('https://soundcloud.com') === 0 || URL.search('https://m.soundcloud.com') === 0) {
      setCurrentPlayer(PLAYER_TYPE.SOUNDCLOUD)
      setPlayerURL({ ...playerURL, SOUNDCLOUD: URL.substring(URL.search('soundcloud.com/') + 'soundcloud.com/'.length) })
    } else {
      return
    }
    resetURLValue()
  }, [ playerURL, resetURLValue ])

  // Return:
  return (
    <Wrapper>
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
              style={{ position: 'relative', zIndex: 1, height: '115px', overflow: 'hidden', background: 'transparent', borderRadius: '10px', transform: 'scale(0.88)' }}
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
              style={{ position: 'relative', zIndex: 1, minWidth: '345px', height: '130px', borderRadius: '10px', transform: 'scale(0.75)' }}
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
                onClick={() => {
                  playButtonPress()
                  if (isOn) setIsOn(false)
                  else setIsOn(true)
                }}
              >
                { !isOn ? <MdPowerSettingsNew style={{ color: 'lightseagreen' }} /> : <MdPowerSettingsNew style={{ color: 'palevioletred' }} /> }
              </Knob>
            </Button>
            <Button>
              <Knob
                selected={ currentPlayer === PLAYER_TYPE.APPLE_MUSIC || !isOn }
                onClick={() => {
                  if (isOn && currentPlayer !== PLAYER_TYPE.APPLE_MUSIC) {
                    playButtonPress()
                  }
                  setCurrentPlayer(PLAYER_TYPE.APPLE_MUSIC)
                }}
              >
                <RiAppleFill />
              </Knob>
            </Button>
            <Button>
              <Knob
                selected={ currentPlayer === PLAYER_TYPE.SPOTIFY || !isOn }
                onClick={() => {
                  if (isOn && currentPlayer !== PLAYER_TYPE.SPOTIFY) {
                    playButtonPress()
                  }
                  setCurrentPlayer(PLAYER_TYPE.SPOTIFY)
                }}
              >
                <RiSpotifyFill />
              </Knob>
            </Button>
            <Button>
              <Knob
                selected={ currentPlayer === PLAYER_TYPE.SOUNDCLOUD || !isOn }
                onClick={() => {
                  if (isOn && currentPlayer !== PLAYER_TYPE.SOUNDCLOUD) {
                    playButtonPress()
                  }
                  setCurrentPlayer(PLAYER_TYPE.SOUNDCLOUD)
                }}
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
              onClick={() => {
                if (isOn && URLValue.length > 0 && isUrl(URLValue)) {
                  playButtonPress()
                  handleMusicURL(URLValue)
                }
              }}
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
