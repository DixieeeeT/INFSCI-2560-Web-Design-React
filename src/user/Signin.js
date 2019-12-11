import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { signin, authenticate } from "../auth";

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        };
    }

    handleChange = name => event => {
        this.setState({ error: "" });
        this.setState({ [name]: event.target.value });
    };


    clickSubmit = event => {
        event.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = {
            email,
            password
        };
            signin(user).then(data => {
                if (data.error) {
                    this.setState({ error: data.error, loading: false });
                } else {
                    authenticate(data, () => {
                        this.setState({ redirectToReferer: true });
                    });
                }
            });

    };



    render() {
        const {
            email,
            password,
            error,
            redirectToReferer,
            loading
        } = this.state;

        if (redirectToReferer) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container">
            <div className="row justify-content-center">
              <div className="col-sm-6">

                  <h2 className="mt-5 mb-5">Sign In</h2>
                <hr />


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

                <form>
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

                    <button
                        onClick={this.clickSubmit}
                        className="btn btn-warning btn-lg active"
                    >
                        Submit
                    </button>
                </form>
                </div>

            </div>
          </div>
        );
    }
}

export default Signin;
