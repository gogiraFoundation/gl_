import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import { FetchError, describeQueryError } from '../FetchError'

describe('describeQueryError', () => {
  it('describes a timeout', () => {
    const error = new axios.AxiosError('timeout')
    error.code = 'ECONNABORTED'
    expect(describeQueryError(error)).toMatch(/timed out/i)
  })

  it('describes a network failure', () => {
    const error = new axios.AxiosError('Network Error')
    expect(describeQueryError(error)).toMatch(/could not reach the API/i)
  })
})

describe('FetchError', () => {
  it('calls retry', async () => {
    const onRetry = jest.fn()
    const user = userEvent.setup()
    render(<FetchError title="Couldn't load posts" message="Try again." onRetry={onRetry} />)
    await user.click(screen.getByRole('button', { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
