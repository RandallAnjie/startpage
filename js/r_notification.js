
document.addEventListener("DOMContentLoaded", function () {
    var div = document.createElement("div");
    div.className = "popup-little-container";
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "20px";
    div.style.zIndex = "9888";
    div.style.maxWidth = "80%";
    document.body.appendChild(div);
    var style = document.createElement("style");
    style.innerHTML = `
        @keyframes flyInFromRight {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
        @keyframes flyInFromTop {
            from {
                transform: translateX(100%) translateY(-100%);
            }
            to {
                transform: translateX(0) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    // 最大保存弹窗数目
    let maxCount = 5;

    /**
     * 获取当前时间
     * @Author:	Anjie
     * @Date:	2023-08-17
     */
    function getNowTime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var date = now.getDate();
        var hour = now.getHours();
        var minu = now.getMinutes();
        var sec = now.getSeconds();
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        return year + "/" + month + "/" + date + " " + hour + ":" + minu + ":" + sec;
    }

    /**
     * 创建弹窗元素
     * @Author:	Anjie
     * @Date:	2023-08-17
     * @param text
     * @param save 是否保存到sessionStorage中，1保存，0不保存
     * @returns {HTMLDivElement}
     */
    function createPopupElement(text, save = 1) {
        if (save === 1) {
            let popupText = sessionStorage.getItem('popupText');
            if (popupText) {
                popupText = JSON.parse(popupText);
            } else {
                popupText = [];
            }
            popupText.push(text);
            if (popupText.length > maxCount) {
                popupText.shift();
            }
            sessionStorage.setItem('popupText', JSON.stringify(popupText));
        }
        const popupLittle = document.createElement('div');
        popupLittle.isRemoved = false;
        popupLittle.className = 'popup-little';
        popupLittle.innerHTML = text;
        // const height = popupLittle.offsetHeight;
        popupLittle.style.cssText = `
					font-size: medium;
					background-color: #fff;
					box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
					border-radius: 4px;
					padding: 10px;
                    max-width: 340px;
					min-width: 340px;
					margin-bottom: 0px;
                    margin-top: 0px;
					transition: opacity 0.5s linear,width 0.5s linear, height 0.5s 0.5s linear, margin-bottom 0.5s 0.5s linear, margin-top 0.5s 0.5s linear;
					overflow: hidden;
				`;
        return popupLittle;
    }

    /**
     * 显示弹窗
     * 2023-09-04 fixed: 重复消息只显示一次
     * @Author:	Anjie
     * @Date:	2023-08-17
     * @param message
     * @param save 是否保存到sessionStorage中，1 保存 0 不保存
     * @param position 在顶部显示还是在底部显示，up 顶部 down 底部
     */
    function showMessage(message, save, position = 'up', autoDisappearTime = 0) {
        let popupText = sessionStorage.getItem('popupText');
        if (popupText) {
            popupText = JSON.parse(popupText);
            if (popupText.indexOf(message) >= 0 && save == 1) {
                return;
            }
        }
        const popupContainer = document.querySelector('.popup-little-container');
        const popupLittle = createPopupElement(message, save);
        if (position === 'up') {
            popupContainer.prepend(popupLittle);
            const rect = popupLittle.getBoundingClientRect();
            const height = rect.height;
            popupLittle.style.animation = 'flyInFromTop 1s forwards';
            // 找到第二个元素，设置其margin-top
            const secondElement = popupContainer.children[1];
            if (secondElement) {
                // Temporarily disable the transition
                secondElement.style.transition = 'none';
                secondElement.style.marginTop = `-${height}px`;

                // Force a reflow to ensure the above changes are applied immediately
                void secondElement.offsetWidth;

                // Re-enable the transition and reset margin-top to start the transition
                secondElement.style.transition = 'opacity 0.5s linear, height 0.5s 0.5s linear, margin-bottom 0.5s 0.5s linear, margin-top 0.5s linear';
                setTimeout(() => {
                    secondElement.style.marginTop = '0px';
                }, 0); // short delay to ensure the transition gets applied
            }

        } else {
            popupContainer.appendChild(popupLittle);
            popupLittle.style.animation = 'flyInFromRight 1s forwards';
        }
        popupLittle.style.opacity = "1";
        const rect = popupLittle.getBoundingClientRect();
        const height = rect.height;
        popupLittle.style.marginBottom = `-${height}px`;
        setTimeout(() => {
            popupLittle.style.marginBottom = '10px';
        }, 10);
        popupLittle.addEventListener('click', () => {
            popupLittle.style.opacity = 0;
            popupLittle.style.marginBottom = `-${height}px`;
            setTimeout(() => {
                if (!popupLittle.isRemoved) {
                    popupContainer.removeChild(popupLittle);
                    popupLittle.isRemoved = true;
                }
            }, 1000);

            // 从sessionStorage中删除当前消息
            let popupText = sessionStorage.getItem('popupText');
            let tempMessage = popupLittle.textContent;
            if (popupText) {
                popupText = JSON.parse(popupText);
                popupText = popupText.filter(item => item != tempMessage);
                sessionStorage.setItem('popupText', JSON.stringify(popupText));
            }
        });
        if (autoDisappearTime > 0) {
            setTimeout(() => {
                popupLittle.style.opacity = 0;
                const rect = popupLittle.getBoundingClientRect();
                const height = rect.height;
                popupLittle.style.marginBottom = `-${height}px`;
                setTimeout(() => {
                    if (!popupLittle.isRemoved) {
                        popupContainer.removeChild(popupLittle);
                        popupLittle.isRemoved = true;
                    }
                }, 1000);

                // 从sessionStorage中删除当前消息
                let popupText = sessionStorage.getItem('popupText');
                let tempMessage = popupLittle.textContent;
                if (popupText) {
                    popupText = JSON.parse(popupText);
                    popupText = popupText.filter(item => item != tempMessage);
                    sessionStorage.setItem('popupText', JSON.stringify(popupText));
                }
            }, autoDisappearTime);
        }
    }

    // 页面加载时，显示sessionStorage中的消息
    let popupText = sessionStorage.getItem('popupText');
    if (popupText) {
        popupText = JSON.parse(popupText);
        popupText.forEach(item => {
            showMessage(item, 0, 'up', 0);
        })
    }

    console.info("您已经成功加载弹窗插件，默认最大存储到session storage中的消息数目为5条\n详细使用方法及细节: https://randallanjie.com/demo/notification/ \nCopyright randallanjie.com © . All rights reserved.\nAuthor: Randall\nWebsite: https://randallanjie.com");
});