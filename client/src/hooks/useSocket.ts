import { useContext } from 'react';
import { SocketContext } from '../contexts/socketDefinition';

export const useSocket = () => {
    return useContext(SocketContext);
};
