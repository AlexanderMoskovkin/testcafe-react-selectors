import { Selector } from 'testcafe';

const ReactSelector = Selector.addComponent({
    name: 'react',

    _getFindElementsByStringFn: stringSelector => {
        var fn = function () {
            const SUPPORTED_REACT_VERSION = 15;

            if (!window.React)
                return document.querySelectorAll(stringSelector);

            const reactVersion = parseInt(window.React.version.split('.')[0], 10);

            if (reactVersion < SUPPORTED_REACT_VERSION)
                throw new Error('testcafe-react-selectors supports React version 15.x and newer');

            const foundComponents = [];

            function getComponentInstance (el) {
                if (el.nodeType !== 1)
                    return null;

                for (var prop of Object.keys(el)) {
                    if (!/^__reactInternalInstance/.test(prop))
                        continue;

                    //NOTE: stateless component
                    if (!el[prop]._currentElement._owner)
                        return null;

                    return el[prop]._currentElement._owner._instance;
                }
            }

            function getComponentName (DOMNode, instance) {
                let reactComponentName     = null;
                const reactComponentParent = instance._reactInternalInstance._renderedComponent._hostNode;

                if (reactComponentParent === DOMNode) {
                    //NOTE: IE hack
                    if (instance.constructor.name)
                        reactComponentName = instance.constructor.name;
                    else {
                        let matches = instance.constructor.toString().match(/^function\s*([^\s(]+)/);

                        reactComponentName = matches ? matches[1] : DOMNode.tagName.toLowerCase();
                    }
                }
                else {
                    reactComponentName = DOMNode.tagName.toLowerCase();
                }

                return reactComponentName;
            }

            var nodes         = document.querySelectorAll('*');
            var nodeLength    = nodes.length;
            var foundInstance = null;
            var componentName = null;
            var node          = null;

            for (var i = 0; i < nodeLength; i++) {
                node          = nodes[i];
                foundInstance = getComponentInstance(node);

                if (foundInstance) {
                    componentName = getComponentName(node, foundInstance);

                    if (stringSelector === componentName)
                        foundComponents.push(node);
                }
            }
        };

        return fn.toString().replace(/stringSelector/g, `${stringSelector}`);
    }/*,

    findComponentFn: selector => {
        const foundComponents = [];
        let foundInstance     = null;

        function getComponentInstance (el) {
            if (el.nodeType !== 1)
                return null;

            for (var prop of Object.keys(el)) {
                if (!/^__reactInternalInstance/.test(prop))
                    continue;

                //NOTE: stateless component
                if (!el[prop]._currentElement._owner)
                    return null;

                return el[prop]._currentElement._owner._instance;
            }
        }

        function getComponentName (DOMNode) {
            let reactComponentName     = null;
            const reactComponentParent = foundInstance._reactInternalInstance._renderedComponent._hostNode;

            if (reactComponentParent === DOMNode) {
                //NOTE: IE hack
                if (foundInstance.constructor.name)
                    reactComponentName = foundInstance.constructor.name;
                else {
                    let matches = foundInstance.constructor.toString().match(/^function\s*([^\s(]+)/);

                    reactComponentName = matches ? matches[1] : DOMNode.tagName.toLowerCase();
                }
            }
            else {
                reactComponentName = DOMNode.tagName.toLowerCase();
                foundInstance      = null;
            }

            return reactComponentName;
        }

        var allElements = document.querySelectorAll('*');


        for (var i = 0; i < allElements.length; i++) {
            if (!(foundInstance = getComponentInstance(node)))
                return null;

            const componentName = getComponentName(node);

            if (selectorElms[selectorIndex] !== componentName)
                return null;

            if (selectorIndex === selectorElms.length - 1)
                foundComponents.push(node);

            selectorIndex++;

            return null;
        }

        return foundComponents;
    }*/
});

export default ReactSelector;