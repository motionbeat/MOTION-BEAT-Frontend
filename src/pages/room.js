import styled from "styled-components"
import React, {useEffect, useState } from 'react';
import socket from "../server/server"
import SelectSong from "../components/room/selectSong";
import WebCam from "../components/room/webCam";
import RoomChatting from "../components/room/roomChatting";

const Room = () => {
    const userId = sessionStorage.getItem("userId");
    return (
        <>
            <RoomWrapper>
                <RoomTitle>문미새님의 게임</RoomTitle>
                <RoomMainWrapper>
                    <SelectSong />
                    <WebCam />
                </RoomMainWrapper>
                <RoomChatting />
            </RoomWrapper>
        </>
    )
}
export default Room;

const RoomWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    padding: 20px 0;
    background-color: #00AA81;
`
// 방제목
const RoomTitle = styled.h1`
    text-align: center;
`
// 노래, 웹캠 등의 전체 박스
const RoomMainWrapper = styled.div`
    width: 80%;
    height: 80vh;
    background-color: #CAFFF5;
    margin: 10px auto 0 auto;
`


