react-dom-validation-hook
==========================================

Custom hook to validate forms using DOM API

## How to use it

```js
import React from 'react'
import ReactDOM from 'react-dom'
import useForm from 'react-dom-validation-hook'

function UserForm () {
  const {
    validation,
    onSubmit,
    onInput,
    hasError,
    getErrors
  } = useForm() // receive a posible error procesor message

  const submit = (event) => {
    const { data } = onSubmit(event)
    console.log(data, validation)
  }
  return (
    <form className='validated-form' noValidate onSubmit={submit}>
      <div className={ hasError('firstName') ? 'validated-form__control error': 'validated-form__control' }>
        <label htmlFor='firstName'>First name</label>
        <input
          onInput={onInput}
          type='text'
          name='firstName'
          data-name='first name'
          id='firstName'
          minLength='2'
          pattern='[a-zA-Z]*'
          required
          autoComplete='on'/>
        <div className='validated-form__errors'>
          {getErrors('firstName').join(', ')}
        </div>
      </div>
      <div className={ hasError('lastName') ? 'validated-form__control error': 'validated-form__control' }>
        <label htmlFor='lastName'>Last name</label>
        <input
          onInput={onInput}
          type='text'
          name='lastName'
          data-name='last name'
          id='lastName'
          required />
        <div className='validated-form__errors'>
          {getErrors('lastName').join(', ')}
        </div>
      </div>
      <div className={ hasError('age') ? 'validated-form__control error': 'validated-form__control' }>
        <label htmlFor='age'>Age</label>
        <input
          onInput={onInput}
          type='number'
          name='age'
          max='90'
          min='18'
          step='1'
          id='age'
          pattern='\d+'
          required
          autoComplete='on'/>
        <div className='validated-form__errors'>
          {getErrors('age').join(', ')}
        </div>
      </div>
      <div className={ hasError('email') ? 'validated-form__control error': 'validated-form__control' }>
        <label htmlFor='email'>Email</label>
        <input
          onInput={onInput}
          type='email'
          name='email'
          id='email'
          required />
        <div className='validated-form__errors'>
          {getErrors('email').join(', ')}
        </div>
      </div>
      <div className='validated-form__actions'>
        <button className='btn' type="submit" >Submit</button>
      </div>
    </form>
  )
}

ReactDOM.render(
  <div>
    <UserForm />
  </div>,
  document.getElementById('root')
)

```

### How to create your errorMessage Procesor

You pass an object with this signature to useForm hook
```js
{
  badInput: (input) => {
    const errorName = input.dataset.name || input.name
    return `Incorrect value for ${errorName}`
  },
  customError: (input) => {
    const errorName = input.dataset.name || input.name
    return `Invalid value for ${errorName}`
  },
  patternMismatch: (input) => {
    const errorName = input.dataset.name || input.name
    return `${errorName} don't match with the pattern`
  },
  rangeOverflow: (input) => {
    const errorName = input.dataset.name || input.name
    return `${errorName} maximun is ${input.max}`
  },
  rangeUnderflow: (input) => {
    const errorName = input.dataset.name || input.name
    return `${errorName} minimum is ${input.max}`
  },
  stepMismatch: (input) => {
    const errorName = input.dataset.name || input.name
    return `${errorName} should grow by ${input.step} at the time`
  },
  tooLong: (input) => {
    const errorName = input.dataset.name || input.name
    return `${errorName} should have ${input.maxLength} or less characteres`
  },
  tooShort: (input) => {
    const errorName = input.dataset.name || input.name
    return `${errorName} should have ${input.minLength} or more characteres`
  },
  typeMismatch: (input) => {
    return `Please write a valid ${input.type}`
  },
  valueMissing: (input) => {
    const errorName = input.dataset.name || input.name
    return `Please enter your ${errorName}`
  }
}
```

### How do develop a feature development

#### How to run the project

```bash
# Install all the dependencies of the project with npm or yarn
yarn # or npm install

# Run the development server with
yarn dev # or npm run dev
```

#### How to run test

```bash
yarn test # or yarn test --watch
```

#### How to build the project

```bash
yarn build # npm run build
```