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
  
type Props = {
    login: (email: string, password: string, errCB: (err:any) => void) => void;
}

  export function LoginPage({ login }:Props) {

    const loginForm = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: (values) => ({
            email: /^\S+@\S+$/.test(values.email) ? null:'Ingresa un correo valido',
            password: values.password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : null,
        })
    })

    const onSubmit = (data:typeof loginForm.values) => {
        login(data.email, data.password, (_err:any) => {
            alert('Email/Contraseña incorrecto')
        })
    }

    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Bienvenido
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Aun no tienes una cuenta?&nbsp;
          <Anchor size="sm" component="button">
            Registrarse
          </Anchor>
        </Text>
  
        <form onSubmit={loginForm.onSubmit(onSubmit)}>
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