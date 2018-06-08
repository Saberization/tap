/**
 * author：Aimer
 * 模拟tap事件
 * 模拟 tap 事件主要过程
 */

(function () {
    'use strict';

    // 先缓存原先的 addEventListener
    const _addEventListener = HTMLElement.prototype.addEventListener;
    const env = navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Browser';
    let count = 1;
    let firstTime = null,
        secondTime = null;

    HTMLElement.prototype.addEventListener = function (evt, callback) {

        if (env === 'Browser') {
            if (evt === 'tap') {
                evt = 'click';
            }

            if (evt === 'doubletap') {
                evt = 'dblclick';
            }
        }

        switch (evt) {
            case 'tap':
                handleEvent(this, callback, 'tap');
                break;

            case 'doubletap':
                handleEvent(this, callback, 'doubletap');
                break;

            default:
                // 如果不是 tap 则默认调用初始的 addEventListener
                _addEventListener.call(this, evt, callback);
                break;
        }
    };

    /**
     * 模拟tap事件
     * @param {HTMLElement} el 当前 dom 元素
     * @param {function} callback 当前回调函数
     * @param {String} evtType 事件类型
     * 1.tap是在touchend之后触发的
     * 触发条件一：移动距离不能大：touchstart - touchend 纵向横向不能超过30px的位移
     * 触发条件二：时间不能长：touchstart - touchend 两者时间要小于 750ms 触发
     */
    function handleEvent(el, callback, evtType) {
        let time = 0,
            timmer = null,
            startX = 0,
            startY = 0,
            moveX = 0,
            moveY = 0,
            timeout = 10,
            touchEndTimmer = null;

        _addEventListener.call(el, 'touchstart', function (e) {
            const touches = e.touches[0];

            startX = touches.pageX;
            startY = touches.pageY;

            if (touchEndTimmer) {
                clearTimeout(touchEndTimmer);
            }

            timmer = setTimeout(function polling() {
                time += timeout;
                timmer = setTimeout(polling, timeout);
            }, timeout);
        });

        _addEventListener.call(el, 'touchmove', function (e) {
            const touches = e.touches[0];

            moveX = touches.pageX;
            moveY = touches.pageY;
        });

        _addEventListener.call(el, 'touchend', function (e) {
            // 清空定时器
            clearTimeout(timmer);

            const distanceX = Math.abs(moveX - startX),
                distanceY = Math.abs(moveY - startY);

            // 先判断是否满足时间间隔小于 750ms
            if (time <= 750) {

                // 触发条件一：位移距离不管是纵向还是横向，均不能超过 30px
                // moveX、moveY 为 0 的时候代表没移动，可以触发callback
                if ((moveX === 0 && moveY === 0) || (distanceX <= 30 || distanceY <= 30)) {

                    // 如果是双击的情况下
                    if (evtType === 'doubletap') {

                        // 初始化第一次时间
                        if (count === 1) {
                            firstTime = firstTime ? firstTime : time;
                            count++;
                        }
                        else if (count === 2) {

                            if (Math.abs(firstTime - secondTime) < 130) {
                                callback.call(el, e);
                            }

                            count = 1;
                        }

                        // 使用完毕后，将 secondTime 重置为0
                        secondTime = 0;
                        touchEndTimmer = setTimeout(function polling() {

                            secondTime += timeout;
                            touchEndTimmer = setTimeout(polling, timeout);
                        }, timeout);
                    }
                    else if (evtType === 'tap') {
                        callback.call(el, e);
                    }
                }
            }

            time = 0;
        });
    }
}());