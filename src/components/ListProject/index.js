import './index.css'

const ListProject = props => {
  const {projectCardDetails} = props
  const {name, imageUrl} = projectCardDetails

  return (
    <li className="list-class">
      <img className="img-class" src={imageUrl} alt={name} />
      <p className="project-heading">{name}</p>
    </li>
  )
}

export default ListProject
