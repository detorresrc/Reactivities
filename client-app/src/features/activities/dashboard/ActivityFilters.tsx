import useActivityStore from "@/store/features/activity"
import Calendar from "react-calendar"
import { Header, Menu } from "semantic-ui-react"

const ActivityFilters = () => {
  const { predicate, setPredicate } = useActivityStore();

  return (
    <>
      <Menu vertical size="large" style={{width: '100%', marginTop: '26px'}}>
        <Header icon='filter' attached color='teal' content='Filters'/>
        <Menu.Item 
          content="All Activities"
          active={predicate.has("all")}
          onClick={() => setPredicate("all", "true")}
          />
        <Menu.Item 
          content="I'm going"
          active={predicate.has("isGoing")}
          onClick={() => setPredicate("isGoing", "true")}/>
        <Menu.Item 
          content="I'm hosting"
          active={predicate.has("isHost")}
          onClick={() => setPredicate("isHost", "true")}/>
      </Menu>
      <Header />
      <Calendar
        onChange={date => setPredicate('startDate', date as Date)}
        value={predicate.get('startDate') || new Date()}
      />
    </>
  )
}

export default ActivityFilters