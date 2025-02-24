import { Button, Container, List, Space, ThemeIcon, Title } from '@mantine/core';
import classes from './styles.module.css';
import { useAuth } from '../../context/auth';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'
import { differenceInSeconds } from 'date-fns';
import { IconCheck } from '@tabler/icons-react';

const HomePage = () => {

  const { user, logout } = useAuth()
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {

    let scheduledTask:any = null
    const checkExp = () => {
      const cookies = document.cookie.split('; ')
      const token = cookies.find(cookie => cookie.startsWith('token='))
      if(token){
        const data = jwtDecode(token.replace('token=', ''))
        const expirationTime = new Date((data.exp?? Date.now())*1000)

        const secondsLeft = differenceInSeconds(expirationTime, new Date())        
        setSecondsLeft(secondsLeft)

          scheduledTask = setTimeout(checkExp, 1000)
        
      }
    }

    checkExp()

    return () => clearTimeout(scheduledTask)
  }, []);

  const horas = String(Math.floor(secondsLeft / 3600)).padStart(2,'0');
  const minutos = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2,'0');
  const segundos = String(secondsLeft % 60).padStart(2,'0');

  return (
    <Container size="md">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Bienvenido <span className={classes.highlight}>{user.name}</span> a esta <br /> aplicacion vacia
          </Title>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              Tu token expirara en: {horas}:{minutos}:{segundos}
            </List.Item>
          </List>

          <Space h="lg" />
          <Button onClick={logout}>
            Cerrar Sesion
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default HomePage