import ReactSelector from '../lib/index.js';

// NOTE: This is a test for a Redux TodoMVC Example (https://github.com/reactjs/redux/tree/master/examples/todomvc)
fixture `fixture`.page `http://localhost:3000/`;

test('Test', async t => {
    // ----------------------------------------------------
    // Should find elements by tagName
    await t.expect(ReactSelector('div').exists).ok();


    // ----------------------------------------------------
    // Should find elements by React Component name
    const todoItem = ReactSelector('TodoItem');

    await t.expect(todoItem.count).eql(1);


    // ----------------------------------------------------
    // Should find elements by React Components hierarchy
    const todoTextInput = ReactSelector('Header TodoTextInput');

    await t
        .typeText(todoTextInput, 'My Item')
        .pressKey('enter')
        .expect(todoItem.count).eql(2);


    // ----------------------------------------------------
    // Should find elements by both, React Component name and tagName
    const todoItemInput = ReactSelector('TodoItem input');

    await t.expect(todoItemInput.count).eql(2);

    const firstInput = todoItem.nth(0).find('input');

    await t
        .expect(todoItem.count).eql(2)
        .click(firstInput)
        .expect(firstInput.checked).ok();


    // ----------------------------------------------------
    // Should provide `getReact` function to get react object ({ props, state }) for the element.
    const completed = todoItem.nth(0).getReact(({ props }) => props.todo.completed);

    await t.expect(completed).eql(true);
});