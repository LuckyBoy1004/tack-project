import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Strings from '../../constants/Strings';
import { ReducerType } from '../../reducers';
import VerifyCodeForm from './VerifyCodeForm';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { AppContext } from '../../App';
import { Button } from '../common/Button';

const SelectionWrapper = styled.div`
  width: 280px;

  display: flex;
  flex-flow: column;
  gap: 16px;
`;

const Wrapper = styled.div`
  width: 280px;
  box-sizing: border-box;
`;

const PreviousLink = styled.a`
  font-family: NanumBarunGothic, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  width: 280px;
  display: block;
  align-items: center;
  text-align: center;
  color: rgba(77, 80, 97, 1);
  text-decoration: none;
  margin-top: 16px;
  user-select: none;
`;

export enum RegisterType {
  // eslint-disable-next-line no-unused-vars
  ONCE,
  // eslint-disable-next-line no-unused-vars
  PERMANENT
}

export const DeviceRegistration: React.FC = () => {
  const history = useHistory();
  const auth = useSelector((state: ReducerType) => state.auth);

  const [registerType, setRegisterType] = useState<RegisterType | null>(null);
  const [error, setError] = useState('');
  const { authClient } = useContext(AppContext);

  const defaultForm = <SelectionWrapper>
    <Button onClick={() => setRegisterType(RegisterType.PERMANENT)}>내 PC 인증 받기</Button>
    <Button onClick={() => setRegisterType(RegisterType.ONCE)}>1회용 인증 받기</Button>
  </SelectionWrapper>;

  useEffect(() => {
    if (registerType !== null) {
      authClient?.requestPasscode({
        email: auth.email,
        password: auth.password,
      });
    }
  }, [registerType]);

  let form = defaultForm;
  if (registerType !== null) {
    const registerDevice = async (permanent: boolean, passcode: string) => {
      try {
        const struct = await authClient?.registerDevice(
            {
              email: auth.email,
              password: auth.password,
            },
            passcode,
            permanent,
        );

        if (struct?.status !== 0 || struct?.success === false) {
          throw new Error(String(struct?.status));
        }

        history.push('/login');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.toString());
        }
        console.error(err);
      }
    };

    switch (registerType) {
      case RegisterType.PERMANENT:
        form = <VerifyCodeForm onSubmit={(passcode) => registerDevice(true, passcode)}/>;
        break;

      case RegisterType.ONCE:
        form = <VerifyCodeForm onSubmit={(passcode) => registerDevice(false, passcode)}/>;
        break;

      default:
        setRegisterType(null);
        break;
    }
  }

  return <Wrapper>
    {form}
    <PreviousLink onClick={() => history.goBack()}>처음으로 돌아가기</PreviousLink>
    <Dialog
      open={error !== ''}
      onClose={() => setError('')}>
      <DialogTitle>
        {Strings.Auth.DEVICE_REGISTRATION_FAILED}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {Strings.Auth.REASON} {error}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  </Wrapper>;
};
