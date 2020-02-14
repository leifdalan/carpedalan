import axios from 'axios';
import * as React from 'react';
import { MemoryRouter } from 'react-router';

import { render } from '@testing-library/react';

import Slash from '../Slash';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('<Slash />', () => {
  beforeEach(jest.resetAllMocks);
  it('should match snapshot', () => {
    const app = render(
      <MemoryRouter>
        <Slash />
      </MemoryRouter>,
    );
    expect(app).toMatchSnapshot();
  });
});
