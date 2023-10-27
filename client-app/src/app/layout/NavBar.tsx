import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import useUserStore from "@/store/features/user";

const NavBar = () => {
  const { user, logout, isLoggedIn } = useUserStore();
  
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} to='/' header>
          <img
            src='/assets/logo.png'
            alt='Logo'
            style={{ marginRight: "10px" }}
          ></img>
          Reactivities
        </Menu.Item>

        {isLoggedIn() && (
          <>
            <Menu.Item as={NavLink} to='/activities' name='Activities'></Menu.Item>
            <Menu.Item>
              <Button
                  positive
                  content='Create Activity'
                  as={NavLink}
                  to='/activities/create'
                />
            </Menu.Item>

            <Menu.Item position="right">
              <Image src={user?.image || '/assets/user.png'} avatar spaced='right'/>
              <Dropdown pointing="top left" text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={`/profiles/${user?.username}`} text='My Profile' icon='user'/>
                  <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}
      </Container>
    </Menu>
  );
};

export default NavBar;
