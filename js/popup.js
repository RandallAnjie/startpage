const magnifier = document.getElementById("magnifier");
let isComposing = false;

magnifier.onclick = function () {
    avgrund.activate("stack");
    avgrund.disableBlur();  // 禁用模糊
};

(function () {

    var container = document.documentElement,
        popup = document.querySelector('.avgrund-popup'),
        cover = document.querySelector('.avgrund-cover'),
        currentState = null;

    addClass(container, 'avgrund-ready');

    /**
     * 弹起键盘事件
     * @Author: Anjie
     * @Date:   2023-09-11
     * @param event
     */
    function onDocumentKeyUp(event) {
        if (event.keyCode === 27) {
            deactivate();
        }
    }

    /**
     * 点击事件
     * @Author: Anjie
     * @Date:   2023-09-11
     * @param event
     */
    function onDocumentClick(event) {
        if (event.target === cover) {
            deactivate();
        }
    }

    /**
     * 打开弹窗
     * @Author: Anjie
     * @Date:   2023-09-11
     * @param state
     */
    function activate(state) {
        document.addEventListener('keyup', onDocumentKeyUp, false);
        document.addEventListener('click', onDocumentClick, false);

        removeClass(popup, currentState);
        addClass(popup, 'no-transition');
        addClass(popup, state);

        setTimeout(function () {
            removeClass(popup, 'no-transition');
            addClass(container, 'avgrund-active');
        }, 0);

        currentState = state;
    }

    /**
     * 关闭弹窗
     * @Author: Anjie
     * @Date:   2023-09-11
     */
    function deactivate() {
        document.removeEventListener('keyup', onDocumentKeyUp, false);
        document.removeEventListener('click', onDocumentClick, false);

        removeClass(container, 'avgrund-active');
    }

    /**
     * 禁用模糊
     * @Author: Anjie
     * @Date:   2023-09-11
     */
    function disableBlur() {
        addClass(document.documentElement, 'no-blur');
    }

    /**
     * 添加类
     * @Author: Anjie
     * @Date:   2023-09-11
     * @param element
     * @param name
     */
    function addClass(element, name) {
        element.className = element.className.replace(/\s+$/gi, '') + ' ' + name;
    }

    /**
     * 移除类
     * Author: Anjie
     * @Date:   2023-09-11
     * @param element
     * @param name
     */
    function removeClass(element, name) {
        element.className = element.className.replace(name, '');
    }

    /**
     * 暴露接口
     * activate: 打开弹窗
     * deactivate: 关闭弹窗
     * disableBlur: 禁用模糊
     * @type {{activate: activate, disableBlur: disableBlur, deactivate: deactivate}}
     */
    window.avgrund = {
        activate: activate,
        deactivate: deactivate,
        disableBlur: disableBlur
    }
})();