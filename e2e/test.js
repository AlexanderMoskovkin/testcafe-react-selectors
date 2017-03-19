import ReactSelector from '../lib/index.js';

fixture `fixture`.page `http://localhost:3000/`;

test('Test', async t => {
    // Selector by tagName
    await t.expect(ReactSelector('div').exists).ok();

    // Selector by React Component Name
    const todoItem = ReactSelector('TodoItem');
    await t.expect(todoItem.count).eql(1);

    // Selector by Components Hierarchy
    const todoTextInput = ReactSelector('Header TodoTextInput');
    await t
        .typeText(todoTextInput, 'My Item')
        .pressKey('enter')
        .expect(todoItem.count).eql(2);

    // Complex Selector with Component name and tagName
    const todoItemInput = ReactSelector('TodoItem input');  // finds elements with tagName `input` and components with name `input`
    await t.expect(todoItemInput.count).eql(2);

    const firstInput = todoItem.nth(0).find('input');

    await t
        .expect(todoItem.count).eql(2)
        .click(firstInput)
        .expect(firstInput.checked).ok();

    const completed = todoItem.nth(0).getReact(react => react.props.todo.completed);
    await t.expect(completed).eql(true, '', { timeout: 10000 });

    // find by component name or cssSelector
    const mainSection    = ReactSelector('MainSection');
    const todoItemByFind = await mainSection.findReact('TodoItem');
    console.log(todoItemByFind);

    //const firstInputByFind = todoItemByFind.nth(0).find('input');

    /*await t
        .expect(todoItemByFind.count).eql(2)
        .click(firstInputByFind)
        .expect(firstInputByFind.checked).ok();*/
    /*
    // react: { props, state, componentName }
    await t.expect(firstInputByFind.react.props.checked).ok();

    const todoItemTodoProps = await todoItemByFind.react.props.todo;
    await t.expect(todoItemTodoProps.completed).ok();

    // complex variables
    await t.expect(firstInput.react.props['todo.completed']).ok();

    const completed = firstInput.getReact(react => react.props.todo.completed);
    await t.expect(completed).ok();

    // filterFn
    const completedItems = todoItemByFind.filter(node => node.react.props.todo.completed);
    await t.expect(completedItems.count).eql(1);
*/
});