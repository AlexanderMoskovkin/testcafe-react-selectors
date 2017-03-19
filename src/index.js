/*global document*/
import { Selector, ClientFunction } from 'testcafe';

const getComponentInstance = ClientFunction(el => {
    if (el.nodeType !== 1)
        return null;

    for (var prop of Object.keys(el)) {
        if (!/^__reactInternalInstance/.test(prop))
            continue;

        //NOTE: stateless component
        if (!el[prop]._currentElement._owner)
            return null;

        const instance = el[prop]._currentElement._owner._instance;

        // TODO: check
        // if(instance._reactInternalInstance._renderedComponent._hostNode !== el)
        //     return null;
        return instance;
    }
});

const getComponentName = ClientFunction((DOMNode, instance) => {
    let reactComponentName     = null;
    const reactComponentParent = instance._reactInternalInstance._renderedComponent._hostNode;

    if (reactComponentParent === DOMNode) {
        //NOTE: IE hack
        if (instance.constructor.name)
            reactComponentName = instance.constructor.name;
        else {
            const matches = instance.constructor.toString().match(/^function\s*([^\s(]+)/);

            reactComponentName = matches ? matches[1] : DOMNode.tagName.toLowerCase();
        }
    }
    else
        reactComponentName = DOMNode.tagName.toLowerCase();

    return reactComponentName;
});

const getReactObj = ClientFunction(node => {
    function copyReactObject (obj) {
        const copiedObj = {};

        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && prop !== 'children')
                copiedObj[prop] = obj[prop];
        }

        return copiedObj;
    }

    const componentInstance = getComponentInstance(node);

    if (!componentInstance)
        return null;

    return {
        state: copyReactObject(componentInstance.state),
        props: copyReactObject(componentInstance.props)
    };
}, { dependencies: { getComponentInstance } });

const filterByComponentName = ClientFunction((node, componentName) => {
    const componentInstance = getComponentInstance(node);

    if (!componentInstance)
        return false;

    return getComponentName(node, componentInstance) === componentName;
}, { dependencies: { getComponentInstance, getComponentName } });


export default function (compositeSelector, options) {
    if (typeof compositeSelector !== 'string')
        throw new Error(`Selector option is expected to be a string, but it was ${typeof compositeSelector}.`);

    const filter = node => {
        /* eslint-disable no-undef */
        return filterByComponentName(node, selector);
        /* eslint-enable no-undef */
    };

    const selectorChunks = compositeSelector.split(' ');

    let res = Selector(() => {
        // TODO: check react
        // window.React can be undefined on the react page
        //const SUPPORTED_REACT_VERSION = 15;

        //if (!window.React && !window.__REACT_DEVTOOLS_GLOBAL_HOOK__)
        //return document.querySelectorAll(selector);

        //const reactVersion = parseInt(window.React.version.split('.')[0], 10);

        //if (reactVersion < SUPPORTED_REACT_VERSION)
        //throw new Error('testcafe-react-selectors supports React version 15.x and newer');
        return document.querySelectorAll('*');
    }, options)(compositeSelector);

    res = res.filter(filter, { filterByComponentName, selector: selectorChunks[0] });

    for (let chunkIdx = 1; chunkIdx < selectorChunks.length; chunkIdx++)
        res = res.find(filter, { filterByComponentName, selector: selectorChunks[chunkIdx] });

    const getReact = ClientFunction((node, fn) => {
        const reactObj = getReactObj(node);

        return reactObj ? fn(reactObj) : null;
    }, { dependencies: { getReactObj } });

    return res.addCustomMethods({ getReact });
}
