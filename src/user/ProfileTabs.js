import React, { Component } from "react";
import { Link } from "react-router-dom";
import strawberry from "../images/strawberry1.jpg";

class ProfileTabs extends Component {
    render() {
        const { posts } = this.props;
        return (
            <div>
                <div>
                    <h3 className="text-warning">{posts.length} Posts</h3>
                    <hr />
                     <div className="row">

                        {posts.map((post, i) => {

                                    return (
                                    <div className="card col-md-4" key={i}>
                                        <div className="card-body">
                                            <img
                                                src={`${
                                                    process.env.REACT_APP_API_URL
                                                }/post/photo/${post._id}`}
                                                alt={post.title}
                                                onError={i =>
                                                    (i.target.src = `${strawberry}`)
                                                }
                                                className="img-thunbnail mb-3"
                                                style={{ height: "200px", width: "100%", objectFit: 'cover' }}
                                            />
                                            <h5 className="card-title">{post.title}</h5>
                                            <p className="card-text">
                                                {post.body.substring(0, 100)}
                                            </p>
                                            <br />
                                            <Link
                                                to={`/post/${post._id}`}
                                                className="btn btn-warning active btn-raised btn-sm"
                                            >
                                                Read more
                                            </Link>
                                        </div>
                                    </div>
                                    );}
                        )}
                    </div>
                </div>
            </div>
        );
    }
}


export default ProfileTabs;
