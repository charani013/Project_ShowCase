import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectCard from '../ListProject'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    projectsList: [],
    activeCategoryId: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.listOfProjects()
  }

  onChangeCategory = event => {
    this.setState({activeCategoryId: event.target.value}, () =>
      this.listOfProjects(),
    )
  }

  listOfProjects = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeCategoryId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeCategoryId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.listOfProjects()
  }

  projectFailure = () => (
    <div className="failure-page">
      <img
        className="img-failure-class"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-header">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="button-class"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  isLoader = () => (
    <div testid="loader" className="isLoader-class">
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={50}
        testid="loader"
      />
    </div>
  )

  projectView = () => {
    const {projectsList} = this.state

    return (
      <ul className="ul-class">
        {projectsList.map(each => (
          <ProjectCard key={each.id} projectCardDetails={each} />
        ))}
      </ul>
    )
  }

  projectRender = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.isLoader()
      case apiStatusConstants.success:
        return this.projectView()
      case apiStatusConstants.failure:
        return this.projectFailure()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId} = this.state
    return (
      <>
        <Header />
        <div className="bg-container">
          <select
            className="select-value"
            value={activeCategoryId}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.projectRender()}
        </div>
      </>
    )
  }
}

export default Projects
