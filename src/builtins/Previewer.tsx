import React, { useRef, useEffect, useState, useContext } from 'react';
import { context } from 'dumi/theme';
import type { IPreviewerProps } from 'dumi-theme-default/src/builtins/Previewer';
import Previewer from 'dumi-theme-default/src/builtins/Previewer';
import debounce from 'lodash.debounce';
import './Previewer.less';

export const VIEWPORT_MSG_TYPE = 'dumi:viewport-demo';

export function removeFaster(list: Array<any>, item: any) {
    const index = list.indexOf(item);
    if (index >= 0) {
        // 10x faster than splice
        list[index] = list[list.length - 1];
        list.pop();
    }
}

export interface ScrollListener {
    (e: Event): void;
}

export const SCROLL_LISTENERS: Array<ScrollListener> = [];

export const createScrollListener = (listener: ScrollListener) => {
    SCROLL_LISTENERS.push(listener);

    return () => removeFaster(SCROLL_LISTENERS, listener);
};

const onScroll = debounce(e => SCROLL_LISTENERS.forEach(listener => listener(e)), 50);

window.addEventListener('scroll', onScroll);

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

        const previewers = [
            ...document.querySelectorAll('.__dumi-default-phone-previewer'),
        ] as Array<HTMLDivElement>;

        if (!isValidWide) return;

        const handler = () => {
            const scrollTop = document.documentElement.scrollTop + 64;
            const index = previewers.findIndex((item, index) => {
                const prevItem = previewers[index - 1];
                const nextItem = previewers[index + 1];
                if (!prevItem) {
                    return item.offsetTop + item.offsetHeight / 2 > scrollTop;
                }
                if (!nextItem) return true;
                return (
                    prevItem.offsetTop + prevItem.offsetHeight / 2 < scrollTop &&
                    item.offsetTop + item.offsetHeight / 2 > scrollTop
                );
            });
            setIsActive(previewers[index] === ref.current);
        };
        // active source code wrapper if scroll into demo
        const unsubscribe = createScrollListener(handler);
        handler();

        return () => unsubscribe();
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
                        // not show source code
                        defaultShowCode: false,
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
