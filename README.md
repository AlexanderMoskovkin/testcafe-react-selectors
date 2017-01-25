# testcafe-react-selectors

An extension which simplifies the work with ReactJS components for [Tescafe](https://github.com/DevExpress/testcafe) e2e testing framework

##Install

`$ npm install testcafe-react-selectors`

##Usage

####Create selector for ReactJS component
`ReactSelector` allows create testcafe `Selector` being passed name of component class or nested component element.
E.g. `ReactSelector('TodoList')`, `ReactSelector('TodoList TodoItem')`, `ReactSelector('TodoItem span')`  etc.
You are free combine this selectors with testcafe `Selector` filter function like `.withText`, `.nth` and [others](http://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/selectors.html#functional-style-selectors)

```js
import ReactSelector from 'testcafe-react-selectors';

fixture('React application testing').page('http://localhost:1337');

test('Add new item', async t => {
    const getEl = ReactSelector('AddItemButton');

    await t.click(getEl);

    const iteamLabel = ReactSelector('Label div')

    await t.expect(iteamLabel.textContent).eql('New Item');
});
```

####Getting of component props and state

As an alternative [testcafe snapshot properties](http://devexpress.github.io/testcafe/documentation/test-api/selecting-page-elements/dom-node-state.html) you can get a `state` or `props` of ReactJS  component. It could be useful for checking assertion and in many cases simplifies an assertion logic.
You can get these data from `react` property of `ReactSelector` snapshot.
The following example illustrates how it can be used:

```js
import ReactSelector from 'testcafe-react-selectors';

fixture('React application testing').page('http://localhost:1337');

test('Add new item', async t => {
    const statusBar = await ReactSelector('Status Bar').react;

    await t
        .expect(statusBar.props.theme).eql('default');
        .expect(statusBar.state.text).eql('my text');
});
```

####Limitations
`testcafe-react-selectors` supports ReactJS statring version 15.
ReactSelector can find component which was inhereted from `React.Component`. For checking of availability you can use [react-dev-tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) extension.
The searching of component starts from root React component, so selectors like `ReactSelector('body MyComponent')` will return `null`.
