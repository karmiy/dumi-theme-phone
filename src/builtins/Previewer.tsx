import React, { useRef, useEffect, useState, useContext } from 'react';
import { context } from 'dumi/theme';
import type { IPreviewerProps } from 'dumi-theme-default/src/builtins/Previewer';
import Previewer from 'dumi-theme-default/src/builtins/Previewer';
import debounce from 'lodash.debounce';
import './Previewer.less';

export const VIEWPORT_MSG_TYPE = 'dumi:viewport-demo';

export default (props: IPreviewerProps) => {
    const ref = useRef<HTMLDivElement>();
    const { meta } = useContext(context);
    const [previewerProps, setPreviewerProps] = useState<null | IPreviewerProps>(null);
    const [isActive, setIsActive] = useState(false);
    // only render mobile phone when screen max than 960px
    // do not disable mobile simulator
    const isValidWide = window?.outerWidth > 960 && meta.phone !== false;
    const isViewPort = !!props.phone;

    /* -------------------- BLOCK: scroll into demo -------------------- */
    useEffect(() => {
        // skip if page not loaded
        /* istanbul ignore next */
        if (!meta.title) return;

        const isFirstDemo =
            document.querySelector('.__dumi-default-phone-previewer') === ref.current;
        const handler = debounce(() => {
            const scrollTop = document.documentElement.scrollTop + 128;

            // post message if scroll into current demo
            const isFallbackFirstDemo = isFirstDemo && scrollTop < ref?.current?.offsetTop;
            const isDetectScrollPosition =
                scrollTop > ref?.current?.offsetTop &&
                scrollTop < ref?.current?.offsetTop + ref?.current?.offsetHeight;

            setIsActive(isFallbackFirstDemo || isDetectScrollPosition);
        }, 50);

        if (isValidWide) {
            // active source code wrapper if scroll into demo
            handler();
            window.addEventListener('scroll', handler);
        }

        return () => window.removeEventListener('scroll', handler);
    }, [props, meta, isValidWide]);

    /* -------------------- BLOCK: preview props -------------------- */
    useEffect(() => {
        if (isValidWide) {
            // rewrite props for device mode
            setPreviewerProps(
                Object.assign(
                    {},
                    {
                        // omit iframe
                        iframe: null,
                        // omit children
                        children: null,
                        // show source code
                        defaultShowCode: true,
                        // hide external action
                        hideActions: ['EXTERNAL' as IPreviewerProps['hideActions'][0]].concat(
                            props.hideActions,
                        ),
                    },
                    props,
                ),
            );
        } else {
            // use standard mode if screen min than 960px
            setPreviewerProps(Object.assign({}, props));
        }
    }, [props, meta, isValidWide]);

    /* -------------------- BLOCK: device viewport -------------------- */
    useEffect(() => {
        if (isViewPort) {
            window.postMessage(
                {
                    type: VIEWPORT_MSG_TYPE,
                    value: JSON.stringify({ identifier: props.identifier, demoUrl: props.demoUrl }),
                },
                '*',
            );
        }
    }, [isViewPort, props]);

    if (isViewPort) return null;

    if (!isValidWide) return <Previewer {...props} />;

    return (
        <div className={meta.mobile !== false ? '__dumi-default-phone-previewer' : null} ref={ref}>
            {previewerProps && (
                <Previewer
                    className={isActive ? '__dumi-default-previewer-target' : null}
                    {...previewerProps}
                />
            )}
        </div>
    );
};
