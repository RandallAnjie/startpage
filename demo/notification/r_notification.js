/* Copyright randallanjie.com © . All rights reserved.
 * Author: Randall  Website: https://randallanjie.com
 */
document.addEventListener("DOMContentLoaded", function () {
    var div = document.createElement("div");
    div.className = "popup-little-container";
    div.style.position = "fixed";
    div.style.top = "20px";
    div.style.right = "20px";
    div.style.zIndex = "9888";
    div.style.maxWidth = `calc(100vh - 2*${div.style.right})`;
    div.style.width = "380px";
    div.style.overflow = "auto";
    div.style.scrollBehavior = "smooth";
    // 设置 maxHeight 为 100% 屏幕高减去 top
    div.style.maxHeight = `calc(100vh - ${div.style.top})`;
    // 设置滚动条样式
    var style = document.createElement("style");
    style.innerHTML = `
        .popup-little-container::-webkit-scrollbar {
            display: none; /* WebKit 浏览器*/
        }
        .popup-little-container {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 和 Edge */
        }
    `;
    document.head.appendChild(style);
    // // 滚动条滑块
    // style = document.createElement("style");
    // style.innerHTML = `
    //     .popup-little-container::-webkit-scrollbar-thumb {
    //         border-radius: 10px;
    //         background-color: rgba(0, 0, 0, 0.2);
    //         background-clip: padding-box;
    //         border: 2px solid transparent;
    //     }`;
    // document.head.appendChild(style);
    // // 滚动条轨道
    // style = document.createElement("style");
    // style.innerHTML = `
    //     .popup-little-container::-webkit-scrollbar-track {
    //         background-color: transparent;
    //         border-radius: 10px;
    //         box-shadow: inset 0px 0px 5px white;
    //     }`;
    // document.head.appendChild(style);

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

    // 页面加载时，显示sessionStorage中的消息
    let popupText = sessionStorage.getItem('popupText');
    if (popupText) {
        popupText = JSON.parse(popupText);
        popupText.forEach(item => {
            showMessageInJS(item, 0, 'up', 0);
        })
    }
});

var showMessageQueue = [];
// 最大保存弹窗数目
let maxCount = 5;

function showMessage() {
    var args = Array.prototype.slice.call(arguments);
    if (document.readyState === "loading") {
        // If the DOM hasn't loaded, queue the function call
        showMessageQueue.push(args);
    } else {
        // If the DOM has loaded, call the showMessage function immediately
        showMessageInJS.apply(null, args);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Once DOM is loaded, execute all the queued showMessage calls
    for (var i = 0; i < showMessageQueue.length; i++) {
        showMessageInJS.apply(null, showMessageQueue[i]);
    }
    console.info("您已经成功加载弹窗插件，当前版本：V1.7\n默认最大存储到session storage中的消息数目为5条\n详细使用方法及细节: https://randallanjie.com/demo/notification/ \nCopyright randallanjie.com © . All rights reserved.\nAuthor: Randall\nWebsite: https://randallanjie.com");
});


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
                /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
                border-radius: 5px;
                padding: 10px;
                width: 340px;
                margin-left: 10px;
                margin-bottom: 0px;
                margin-top: 10px;
                transition: opacity 0.5s linear,width 0.5s linear, height 0.5s 0.5s linear, margin-bottom 0.5s 0.5s linear, margin-top 0.5s 0.5s linear, box-shadow 0.5s linear;
                overflow: hidden;
                position: absolute
                z-index: 9988;
            `;
    return popupLittle;
}

/**
 * 处理弹窗的移除
 * @Author:	Anjie
 * @Date:	2023-09-15
 * @param {*} popupElement 
 * @param {*} height 
 */
function handleRemoval(popupElement, height) {
    const popupContainer = document.querySelector('.popup-little-container');
    popupElement.style.opacity = 0;
    popupElement.style.marginBottom = `-${height + 10}px`;
    popupElement.friend.style.opacity = 0;
    popupElement.friend.style.marginBottom = `-${height + 10}px`;
    setTimeout(() => {
        if (!popupElement.isRemoved && popupContainer.contains(popupElement)) {
            // 判断popupElement是在popupContainer中还是在body中
            if (popupElement.parentElement === popupContainer) {
                popupContainer.removeChild(popupElement);
                if (document.body.contains(popupElement.friend)) { // 确保friend是body的子元素
                    document.body.removeChild(popupElement.friend);
                }
            } else if (document.body.contains(popupElement)) { // 确保popupElement是body的子元素
                document.body.removeChild(popupElement);
                popupContainer.removeChild(popupElement.friend);
            }
            popupElement.isRemoved = true;
            popupElement.friend.isRemoved = true;
        }        
    }, 1000);

    // 从sessionStorage中删除当前消息
    let popupText = sessionStorage.getItem('popupText');
    let tempMessage = popupElement.textContent;
    if (popupText) {
        popupText = JSON.parse(popupText);
        popupText = popupText.filter(item => item != tempMessage);
        sessionStorage.setItem('popupText', JSON.stringify(popupText));
    }
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
function showMessageInJS(message, save, position = 'up', autoDisappearTime = 0) {
    let popupText = sessionStorage.getItem('popupText');
    if (popupText) {
        popupText = JSON.parse(popupText);
        if (popupText.indexOf(message) >= 0 && save == 1) {
            return;
        }
    }
    const popupContainer = document.querySelector('.popup-little-container');
    const popupLittle = createPopupElement(message, save);

    const animateFlyIn = (element, animationName) => {
        const clone = element.cloneNode(true);

        clone.addclass = 'test';
        
        clone.addEventListener('click', () => {
            const rect = popupLittle.getBoundingClientRect();
            const height = rect.height;
            handleRemoval(popupLittle, height);
            if (clone.parentElement) {
                document.body.removeChild(clone);  // 同时删除复制的元素
            }
        });
        
        document.body.appendChild(clone);

        const animationDuration = 1000;  // 假设动画持续时间为1秒
    
        const updatePosition = () => {
            const rect = element.getBoundingClientRect();
            clone.style.top = `${rect.top-10}px`;
            clone.style.left = `${rect.left-10}px`;
            clone.style.position = 'fixed';
            clone.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            clone.style.zIndex = '9998';

            clone.friend = popupLittle;
            popupLittle.friend = clone;

            clone.style.pointerEvents = 'none';

    
            if (clone.parentElement) {
                requestAnimationFrame(updatePosition);
            }
        };
    
        requestAnimationFrame(updatePosition);
    
        // setTimeout(() => {
        //     clone.style.boxShadow = 'none';
            
        //     setTimeout(() => {
        //         document.body.removeChild(clone);
        //     }, 5000);
        // }, animationDuration);
    };
    
    if (position === 'up') {
        popupContainer.prepend(popupLittle);
        animateFlyIn(popupLittle, 'flyInFromTop');

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
            secondElement.style.transition = 'opacity 0.5s linear, height 0.5s 0.5s linear, margin-bottom 0.5s 0.5s linear, margin-top 0.5s linear, box-shadow 0.5s linear';
            setTimeout(() => {
                secondElement.style.marginTop = '0px';
            }, 0); // short delay to ensure the transition gets applied
        }
        // 平滑滚动到顶部
        popupContainer.scrollTop = 0;
        popupLittle.style.opacity = "1";
        // rect = popupLittle.getBoundingClientRect();
        // height = rect.height;
        popupLittle.style.marginBottom = `-${height}px`;
        setTimeout(() => {
            popupLittle.style.marginBottom = '10px';
        }, 10);
    } else if (position === 'down') {
        popupContainer.appendChild(popupLittle);
        animateFlyIn(popupLittle, 'flyInFromRight');

        popupContainer.appendChild(popupLittle);
        popupLittle.style.animation = 'flyInFromRight 1s forwards';
        // 平滑滚动到底部
        popupContainer.scrollTop = popupContainer.scrollHeight;
        popupLittle.style.opacity = "1";
        // const rect = popupLittle.getBoundingClientRect();
        // const height = rect.height;
        // popupLittle.style.marginBottom = `-${height}px`;
        setTimeout(() => {
            popupLittle.style.marginBottom = '10px';
        }, 10);
    }
    // setTimeout(() => {
    //     popupLittle.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    // }, 5000);

    popupLittle.addEventListener('click', () => {
        const rect = popupLittle.getBoundingClientRect();
        const height = rect.height;
        handleRemoval(popupLittle, height);
    });
    
    if (autoDisappearTime > 0) {
        setTimeout(() => {
            const rect = popupLittle.getBoundingClientRect();
            const height = rect.height;
            handleRemoval(popupLittle, height);
        }, autoDisappearTime);
    }
    
}
