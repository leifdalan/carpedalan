import axios, { AxiosPromise, AxiosResponse, AxiosStatic } from 'axios';
import { shallow } from 'enzyme';
import { UserContext, UserProvider } from 'providers/User';
import * as React from 'react';
import { MemoryRouter, Redirect, Route } from 'react-router';
import { BrowserRouter, Link } from 'react-router-dom';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitForElement,
} from 'react-testing-library';

import Slash from '../Slash';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('<Slash />', () => {
  beforeEach(jest.resetAllMocks);
  it('should match snapshot', () => {
    const app = shallow(<Slash />);
    expect(app).toMatchSnapshot();
  });

  it('should call the api on mount', async () => {
    mockedAxios.get.mockImplementation(
      () =>
        Promise.resolve({
          data: {
            data: [{ key: '1' }],
            meta: {
              count: 1000,
            },
          },
        }) as AxiosPromise,
    );
    const stuff = render(
      <BrowserRouter>
        <Slash />
      </BrowserRouter>,
    );
    console.log(stuff.container);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
  });
});
