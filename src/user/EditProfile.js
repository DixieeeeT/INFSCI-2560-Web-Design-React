import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import strawberry from "../images/strawberry1.jpg";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
      about: ""
    };
  }

  init = userId => {
    const token = this.isAuthenticated().token;
    this.read(userId, token).then(data => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          error: "",
          about: data.about
        });
      }
    });
  };

  isAuthenticated = () => {
      if (typeof window == 'undefined') {
          return false;
      }

      if (localStorage.getItem('jwt')) {
          return JSON.parse(localStorage.getItem('jwt'));
      } else {
          return false;
      }
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  read = (userId, token) => {
      return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
          method: "GET",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
          }
      })
          .then(response => {
              return response.json();
          })
          .catch(err => console.log(err));
  };

  update = (userId, token, user) => {
      console.log("USER DATA UPDATE: ", user);
      return fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
          method: "PUT",
          headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`
          },
          body: user
      })
          .then(response => {
              return response.json();
          })
          .catch(err => console.log(err));
  };

  updateUser = (user, next) => {
      if (typeof window !== "undefined") {
          if (localStorage.getItem("jwt")) {
              let auth = JSON.parse(localStorage.getItem("jwt"));
              auth.user = user;
              localStorage.setItem("jwt", JSON.stringify(auth));
              next();
          }
      }
  };


  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false
      });
      return false;
    }
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: "A valid Email is required",
        loading: false
      });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false
      });
      return false;
    }
    return true;
  };

  handleChange = name => event => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = event => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = this.isAuthenticated().token;

      this.update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else if (this.isAuthenticated().user.role === "admin") {
          this.setState({
            redirectToProfile: true
          });
        } else {
          this.updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  signupForm = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Profile Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <button onClick={this.clickSubmit} className="btn btn-raised btn-warning">
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : strawberry;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={photoUrl}
          onError={i => (i.target.src = `${strawberry}`)}
          alt={name}
        />

        {(this.isAuthenticated().user.role === "admin" ||
        this.isAuthenticated().user._id === id) &&
          this.signupForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;
