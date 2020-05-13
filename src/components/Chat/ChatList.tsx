import React from 'react';
import styled from 'styled-components';
import {ChatChannel} from "../../../public/src/NodeKakaoPureObject";
import ChatListItem from './ChatListItem';

const Wrapper = styled.div`
width: 309px;
height: 100%;
display: flex;
flex-direction: column;
background: #FFFFFF;
overflow-y: scroll;
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
`;

const ChatList: React.FC<{channelList: ChatChannel[]}> = ({channelList}) => {
  return (
    <Wrapper>
      {channelList.map((channel) => <ChatListItem lastChat={channel.lastChat ? channel.lastChat.text : ''} profileImageSrc={channel.channelInfo.roomFullImageURL} username={channel.channelInfo.name} />)}
    </Wrapper>
  );
};

export default ChatList;
