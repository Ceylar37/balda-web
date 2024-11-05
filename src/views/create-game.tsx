import { createGame } from '@/api';
import { cn } from '@/shared/utils';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type Fields = {
  matrix: string;
} & {
  [key: string]: string;
};

export const CreateGame = () => {
  const { login } = useAuthStore();
  const [inputs, setInputs] = useState([Date.now()]);
  const navigate = useNavigate();

  const {
    register,
    unregister,
    control,
    formState: { errors },
    setError,
    handleSubmit
  } = useForm<Fields>({
    defaultValues: {
      matrix: '5'
    }
  });

  const onAddInput = () => {
    setInputs((inputs) => [...inputs, Date.now()]);
  };

  const onRemoveInput = (id: number) => {
    setInputs((inputs) => inputs.filter((currentId) => id !== currentId));
    unregister(id.toString());
  };

  const onSubmit = handleSubmit(async ({ matrix, ...data }) => {
    if (!login) {
      return;
    }

    const inputs = Object.entries(data);
    const errorInput = inputs.find(([, value]) => value.trim() === '');
    if (errorInput) {
      setError(errorInput[0], { type: 'required', message: 'Поле обязательно для заполнения' });
      return;
    }

    try {
      const response = await createGame({
        matrixSize: Number(matrix),
        playerLogins: [login, ...Object.values(data)]
      });

      if (response.payload?.id) {
        return navigate('/' + response.payload.id);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error) {
        const errorInput = inputs.find(([, value]) => value === error.cause.response.data.description.slice(33));
        if (errorInput) {
          setError(errorInput[0], { type: 'required', message: 'Пользователь не найден' });
        }
      }
    }
  });

  return (
    <form onSubmit={onSubmit} className='p-4 space-y-3 flex-1 flex flex-col'>
      <label htmlFor='matrix'>Размер поля</label>
      <Controller
        name='matrix'
        control={control}
        render={({ field: { value, onBlur, onChange } }) => (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger id='matrix' onBlur={onBlur}>
              <SelectValue placeholder='Выберите размер поля' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='3'>3x3</SelectItem>
                <SelectItem value='5'>5x5</SelectItem>
                <SelectItem value='7'>7x7</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      <h2 className='h3'>Игроки:</h2>
      <ul className='space-y-2'>
        {inputs.map((id, index) => (
          <li key={id} className='grid grid-cols-[1fr_auto] gap-x-2 gap-y-1'>
            <div className='col-span-2 flex items-end justify-between'>
              <label htmlFor={id.toString()}>Игрок {index + 1}</label>
              <span className='small text-error'>{errors[id.toString()]?.message}</span>
            </div>
            <Input
              id={id.toString()}
              placeholder='Логин игрока'
              {...register(id.toString(), {
                required: 'Это поле обязательно к заполнению'
              })}
              className={cn(errors[id.toString()] && 'border-error')}
            />
            <Button onClick={() => onRemoveInput(id)} variant='outline' className='w-9 h-9'>
              <Trash color='red' />
            </Button>
          </li>
        ))}
      </ul>
      <Button onClick={onAddInput} variant='secondary'>
        Добавить игрока
      </Button>
      <Button disabled={inputs.length < 1} type='submit'>
        Создать
      </Button>
    </form>
  );
};
