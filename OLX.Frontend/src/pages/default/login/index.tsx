import React, { useRef, useState } from 'react'
import { Button, Checkbox, Divider, Form } from 'antd';
import { ILoginLocalRequest } from '../../../models/account';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toast } from 'react-toastify';
import { IError, IUserLockoutError } from '../../../models/errors';
import { useGoogleLoginMutation, useLoginMutation, useSendConfirmEmailMutation } from '../../../redux/api/accountApi';
import PrimaryButton from '../../../components/primary_button';
import FormInput from '../../../components/form_input';
import { Images } from '../../../constants/images';

const loginAction: string = 'login'

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading: IsLoginLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();
  const [sendConfEmail, { isLoading: isConfirmEmailLoading }] = useSendConfirmEmailMutation();
  const [emailConfirmationError, setEmailConfirmationError] = useState<boolean>(false)
  const { executeRecaptcha } = useGoogleReCaptcha();
  const loginEmail = useRef<string | undefined>('')
  const remeber = useRef<boolean>(true)

  const glLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin(({ token: tokenResponse.access_token, remember: remeber.current }))
      if (!result.error) {
        toast("Ви успішно увійшли в свій акаунт", {
          type: "success"
        })
      }
      else {
        loginEmail.current = ((result.error as IError).data as IUserLockoutError)?.Email || undefined;
        if ((result.error as IError).status === 403) {
          setEmailConfirmationError(true);
        }
      }
    }
  });

  const sendConfirmEmail = async () => {
    if (loginEmail.current) {
      const result = await sendConfEmail(loginEmail.current);
      if (!result.error) {
        setEmailConfirmationError(false)
        toast("Лист підтвердження відправлено на вашу пошту", {
          type: "success"
        })
      }
    }
    else {
      toast("Сталася помилка при відправці листа підтвердження", {
        type: "error"
      })
    }

  }

  const onFinish = async (loginModel: ILoginLocalRequest) => {
    setEmailConfirmationError(false);
    if (executeRecaptcha) {
      loginModel.recapthcaToken = await executeRecaptcha(loginAction);
      loginModel.action = loginAction
      const result = await login(loginModel);
      if (result.error) {
        loginEmail.current = ((result.error as IError)?.data as IUserLockoutError)?.Email || undefined;
        if ((result.error as IError).status === 403) {
          setEmailConfirmationError(true);
        }
      }
      else {
        toast("Ви успішно увійшли в свій акаунт", {
          type: "success"
        })
      }
    }
  }

  return (
    <div className="flex h-screen w-screen  justify-between">
      <div className="w-[50%] h-[100%]">
        <img className="w-[100%] h-[100%]" src={Images.loginImage} />
      </div>
      <div id='#login' className="mx-auto flex flex-col items-center justify-center text-center">
        <h2 className='text-[#3A211C] mb-[50px] font-unbounded text-[36px] font-normal'>З поверненням!</h2>
        <Form
          layout='vertical'
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
        >
          <FormInput
            label='Електронна пошта'
            name='email'
            placeholder='example@gmail.com'
            rules={[
              { required: true, message: 'Будь ласка, введіть електронну пошту' },
              { type: 'email', message: 'Неправильний формат електронної пошти' }
            ]} />
          <FormInput
            label='Пароль'
            name='password'
            placeholder='eXampLe_3'
            rules={[
              { required: true, message: 'Будь ласка, введіть пароль' }
            ]} />

          <div className='flex justify-between'>
            <Form.Item
              name="remember"
              valuePropName="checked"
            >
              <Checkbox onChange={(event) => { remeber.current = event.target.checked }}>запам'ятати мене</Checkbox>
            </Form.Item>

            <Button onClick={() => navigate('password')} className='text-[#3A211C] font-montserrat border-none underline forget-password' variant="link">
              забули пароль?
            </Button>
          </div>

          <PrimaryButton
            title={!emailConfirmationError ? 'Увійти' : "Надіслати лист для підтвердження"}
            htmlType={!emailConfirmationError ? 'submit' : 'button'}
            onButtonClick={emailConfirmationError ? sendConfirmEmail : () => { }}
            isLoading={!emailConfirmationError ? IsLoginLoading : isConfirmEmailLoading} />
          <Divider style={{ color: '#9B7A5B', fontWeight: '400' }}>або</Divider>
          <PrimaryButton title='Увійти з Google' onButtonClick={glLogin} isLoading={isGoogleLoading} />
        </Form>
      </div>
    </div>
  )
}
export default LoginPage;