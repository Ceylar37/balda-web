import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AbstractResponseTokenResponse, LoginRequest, RegisterRequest } from '@/api/_model';
import { login, register } from '@/api/requests';
import { cn } from '@/shared/utils';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';

type Type = 'login' | 'register';
interface Option {
  title: string;
  linkTitle: string;
  link: Type;
  fn: (data: LoginRequest | RegisterRequest) => Promise<AbstractResponseTokenResponse>;
  buttonTitle: string;
}

const options: Record<Type, Option> = {
  login: {
    title: 'Вход',
    linkTitle: 'Нет аккаунта?',
    link: 'register',
    fn: login,
    buttonTitle: 'Войти'
  },
  register: {
    title: 'Регистрация',
    linkTitle: 'Уже есть аккаунт?',
    link: 'login',
    fn: register,
    buttonTitle: 'Зарегистрироваться'
  }
};

export const Authorization = () => {
  const [type, setType] = useState<Type>('login');

  const { title, linkTitle, fn, link, buttonTitle } = options[type];

  const authStore = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterRequest>();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const response = await fn({
        login: data.login,
        password: data.password
      });

      if (response.payload && response.payload.accessToken && response.payload.refreshToken) {
        authStore.setTokens({
          accessToken: response.payload.accessToken,
          refreshToken: response.payload.refreshToken
        });
        authStore.setLogin(data.login ?? '');
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.cause &&
        typeof error.cause === 'object' &&
        'response' in error.cause &&
        error.cause.response &&
        typeof error.cause.response === 'object' &&
        'data' in error.cause.response &&
        error.cause.response.data &&
        typeof error.cause.response.data === 'object' &&
        'description' in error.cause.response.data &&
        typeof error.cause.response.data.description === 'string'
      ) {
        setError(error.cause.response.data.description);
        return;
      }

      setError('Неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className='h-svh w-svw flex justify-center items-center'>
      <form onSubmit={onSubmit} className='w-full h-max flex flex-col p-3 gap-2'>
        <h1>{title}</h1>
        <span className='text-error'>{error}</span>
        <span className={cn(errors.login && 'text-error')}>Логин</span>
        <Input {...register('login', { required: true })} />
        <span className={cn(errors.password && 'text-error')}>Пароль</span>
        <Input {...register('password', { required: true })} type='password' />
        <Button variant='link' onClick={() => setType(link)}>
          {linkTitle}
        </Button>
        <Button variant='default' disabled={isLoading} type='submit'>
          {buttonTitle}
        </Button>
      </form>
    </div>
  );
};
