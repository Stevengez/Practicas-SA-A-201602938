import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './styles.module.css';
import { useForm } from '@mantine/form';
import { useState } from 'react';

type Props = {
  login: (email: string, password: string, errCB: (err: any) => void) => void;
  register: (name: string, email: string, password: string, errCB: (err: any) => void) => void;
}

export function LoginPage({ login, register }: Props) {

  const [showRegister, toggleForm] = useState(false)


  const loginForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => ({
      email: /^\S+@\S+$/.test(values.email) ? null : 'Ingresa un correo valido',
      password: values.password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : null,
    })
  })

  const registerForm = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate: (values) => ({
      email: /^\S+@\S+$/.test(values.email) ? null : 'Ingresa un correo valido',
      name: values.name.length === 0 ? 'Nombre debe tener al menos un caracter' : null,
      password: values.password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : null,
    })
  })

  const onLogin = (data: typeof loginForm.values) => {
    login(data.email, data.password, (_err: any) => {
      alert('Email/Contraseña incorrecto')
    })
  }

  const onRegister = (data: typeof registerForm.values) => {
    register(data.name, data.email, data.password, (_err: any) => {
      alert('Error al completar registro incorrecto')
    })
  }

  if (showRegister)
    return <Container size={420} my={40}>
      <form onSubmit={registerForm.onSubmit(onRegister)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            {...registerForm.getInputProps('name')}
            key={registerForm.key('name')}
            label="Nombre"
            placeholder="juan perez"
          />
          <TextInput
            {...registerForm.getInputProps('email')}
            key={registerForm.key('email')}
            label="Email"
            placeholder="correo@micorreo.com"
          />
          <PasswordInput
            {...registerForm.getInputProps('password')}
            key={registerForm.key('password')}
            label="Contraseña"
            placeholder="Contraseña"
            mt="md"
          />

          <Button type='submit' fullWidth mt="xl">
            Registrarse
          </Button>
          <Button fullWidth mt="xl" onClick={() => toggleForm(prev => !prev)}>
            Volver
          </Button>
        </Paper>
      </form>
    </Container>

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Bienvenido
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Aun no tienes una cuenta?&nbsp;
        <Anchor size="sm" component="button" onClick={() => toggleForm(prev => !prev)}>
          Registrarse
        </Anchor>
      </Text>

      <form onSubmit={loginForm.onSubmit(onLogin)}>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            {...loginForm.getInputProps('email')}
            key={loginForm.key('email')}
            label="Email"
            placeholder="correo@micorreo.com"
          />
          <PasswordInput
            {...loginForm.getInputProps('password')}
            key={loginForm.key('password')}
            label="Contraseña"
            placeholder="Contraseña"
            mt="md"
          />

          <Button type='submit' fullWidth mt="xl">
            Iniciar Sesion
          </Button>
        </Paper>
      </form>
    </Container>
  );
}