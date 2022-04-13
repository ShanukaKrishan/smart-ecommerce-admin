import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import HomeLayout from '../components/HomeLayout';
import 'stream-chat-react/dist/css/index.css';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  CustomStyles,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRtaW4ifQ.j1P5nK0yUnuX_qpBCqsCo44OipuwX2ip-xoMX6Ee9s0';

const ChatPage: NextPage = () => {
  /* --------------------------------- hooks -------------------------------- */

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance('buvy5dm8f6vj');
      await client.connectUser(
        {
          id: 'admin',
          name: 'Admin',
          image:
            'https://getstream.io/random_png/?id=restless-bonus-3&name=restless',
        },
        userToken
      );
      setChatClient(client);
    };
    initChat();
  }, []);

  /* -------------------------------- styles -------------------------------- */

  const customStyles: CustomStyles = {
    '--primary-color': '#a37f71',
    '--grey-gainsboro': '#FFFFFF',
    '--white': '#FCFCFC',
    '--main-font': 'Montserrat',
    '--second-font': 'Montserrat',
  };

  /* -------------------------------- render -------------------------------- */

  if (chatClient == null) return <LoadingIndicator />;

  return (
    <Chat client={chatClient} customStyles={customStyles}>
      <ChannelList sort={{ last_message_at: -1 }} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   exports                                  */
/* -------------------------------------------------------------------------- */

(ChatPage as any).Layout = HomeLayout;

export default ChatPage;
