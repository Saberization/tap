/**
 * author：Aimer
 * 模拟tap事件
 * 模拟 tap 事件主要过程
 */

(function () {
    'use strict';

    // 先缓存原先的 addEventListener
    const _addEventListener = HTMLElement.prototype.addEventListener;

    HTMLElement.prototype.addEventListener = function (evt, callback) {

        switch (evt) {
            case 'tap':
                tap(this, callback);
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
     * 1.tap是在touchend之后触发的
     * 触发条件一：移动距离不能大：touchstart - touchend 纵向横向不能超过30px的位移
     * 触发条件二：时间不能长：touchstart - touchend 两者时间要小于 750ms 触发
     */
    function tap(el, callback) {
        let time = 0,
            timmer = null,
            startX = 0,
            startY = 0,
            moveX = 0,
            moveY = 0,
            timeout = 100;

        _addEventListener.call(el, 'touchstart', function (e) {
            const touches = e.touches[0];

            startX = touches.pageX;
            startY = touches.pageY;

            timmer = setTimeout(function polling() {
                time += 100;
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
                if (moveX === 0 && moveY === 0) {
                    callback(e);

                    // 满足条件 return
                    return;
                }

                // distanceX、distanceY 位移距离不能超过30px
                if (distanceX <= 30 || distanceY <= 30) {
                    callback(e);

                    // 满足条件 return
                    return;
                }
            }
        });
    }
}());