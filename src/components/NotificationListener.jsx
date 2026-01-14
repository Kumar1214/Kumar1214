import React, { useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../utils/notification';
import toast from 'react-hot-toast';

const NotificationListener = () => {
    // const [notification, setNotification] = useState({ title: '', body: '' });

    useEffect(() => {
        // Request permission on mount
        const getPermission = async () => {
            const token = await requestNotificationPermission();
            if (token) {
                // Ideally, send this token to backend to associate with user
                // console.log('Notification Token:', token);
            }
        };

        getPermission();
    }, []);

    onMessageListener()
        .then((payload) => {
            // setNotification({
            //     title: payload.notification.title,
            //     body: payload.notification.body,
            // });
            toast.success(`${payload.notification.title}: ${payload.notification.body}`, {
                duration: 5000,
                position: 'top-right',
            });
        })
        .catch((err) => console.log('failed: ', err));

    return null; // This component doesn't render anything visible
};

export default NotificationListener;
