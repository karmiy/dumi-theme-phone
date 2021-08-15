import type { FC } from 'react';
import React, { useState, useContext, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { context, usePrefersColor } from 'dumi/theme';
import './Device.less';

interface IDeviceProps {
    className?: string;
    url: string;
}

const getDateTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

const Device: FC<IDeviceProps> = ({ url, className }) => {
    const [renderKey, setRenderKey] = useState(Math.random());
    const [color] = usePrefersColor();
    const now = new Date();
    const contextValue = useContext(context);
    const { mode } = contextValue?.config ?? {};
    const { supplier = 'dumi', time = getDateTime(now) } = contextValue?.meta?.phone ?? {};

    // re-render iframe if prefers color changed
    useEffect(() => {
        setRenderKey(Math.random());
    }, [color]);

    return (
        <div
            className={['__dumi-default-phone-device'].concat(className).join(' ')}
            data-device-type='iOS'
            data-mode={mode}
        >
            <div className='__dumi-default-phone-device-status'>
                <span>{supplier}</span>
                <span>{time}</span>
            </div>
            <iframe title='dumi-previewer' src={url} key={renderKey} />
            <div className='__dumi-default-phone-device-action'>
                <button
                    className='__dumi-default-icon'
                    role='refresh'
                    onClick={() => setRenderKey(Math.random())}
                />
                <button className='__dumi-default-icon' role='qrcode'>
                    <QRCode value={url} size={96} />
                </button>
                <a
                    href={url}
                    target='_blank'
                    rel='noreferrer'
                    className='__dumi-default-icon'
                    role='open-demo'
                />
            </div>
        </div>
    );
};

export default Device;
