import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  brand: yup.string().required("This is required"),
  title: yup.string().required("This is required"),
  category: yup.string().required("This is required"),
  price: yup.number().positive("Price must be a positive number").required(),
});

interface IProduct {
  id: number;
  brand: string;
  title: string;
  category: string;
  price: number;
}

interface IFormData {
  brand: string;
  title: string;
  category: string;
  price: number;
}

export function ProListing() {
  const [prodata, setProdata] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>({ resolver: yupResolver(schema) });

  const [page, setPage] = useState<number>(1);
  const rowsPerPage: number = 10;
  const indexOfLastItem = page * rowsPerPage;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get<{ products: IProduct[] }>("https://dummyjson.com/products")
      .then((res) => {
        setProdata(res.data.products);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const LoadEdit = (id: number) => {
    const selected = prodata.find((product) => product.id === id);
    if (selected) {
      setSelectedProduct(selected);
      setId(selected.id.toString());
      setBrand(selected.brand);
      setTitle(selected.title);
      setCategory(selected.category);
      setPrice(selected.price.toString());
      setShowModal(true);
      reset(selected);
    }
  };

  const Removefunction = (id: number) => {
    if (window.confirm("Do you want to remove?")) {
      axios
        .delete(`https://dummyjson.com/products/${id}`)
        .then(() => {
          alert("Remove successfully.");
          const updatedProducts = prodata.filter(
            (product) => product.id !== id
          );
          setProdata(updatedProducts);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const handleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      reset({
        brand: "",
        title: "",
        category: "",
        price: undefined,
      });
      setId("");
      setBrand("");
      setTitle("");
      setCategory("");
      setPrice("");
      setSelectedProduct(null);
    }
  };

  // const resetFormFields = () => {
  //   setId("");
  //   setBrand("");
  //   setTitle("");
  //   setCategory("");
  //   setPrice("");
  // };

  const onSubmit: SubmitHandler<IFormData> = (formData) => {
    if (selectedProduct) {
      const updatedData = {
        brand: formData.brand,
        title: formData.title,
        category: formData.category,
        price: formData.price,
      };
      axios
        .put(
          `https://dummyjson.com/products/${selectedProduct.id}`,
          updatedData
        )
        .then((response) => {
          console.log(response.data);
          alert("Product updated successfully.");
          setProdata((prevProdata) => {
            return prevProdata.map((product) =>
              product.id === selectedProduct.id
                ? { ...product, ...updatedData }
                : product
            );
          });
          handleModal();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      const nextId =
        prodata.length > 0 ? prodata[prodata.length - 1].id + 1 : 1;
      axios
        .post("https://dummyjson.com/products/add", { ...formData, id: nextId })
        .then((_response) => {
          console.log(_response.data);
          alert("Saved successfully.");
          const createdProduct = { ...formData, id: nextId };
          setProdata([...prodata, createdProduct]);
          handleModal();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Product Listing</h2>
        </div>
        <div className="card-body">
          <div className="divbtn">
            <Button className="primary" onClick={handleModal}>
              Create New (+)
            </Button>

            <Modal show={showModal} onHide={handleModal}>
              <Modal.Header closeButton>
                <Modal.Title>Create/Update</Modal.Title>
              </Modal.Header>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                  <div className="row">
                    <div className="offset-lg-3 col-lg-6">
                      <div className="container">
                        <div className="card" style={{ textAlign: "left" }}>
                          <div className="card-title">
                            <h2>Product Details</h2>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="form-group">
                                  <label>ID</label>
                                  <input
                                    value={id}
                                    disabled
                                    className="form-control"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="form-group">
                                  <label>Brand</label>
                                  <input
                                    {...register("brand")}
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="form-control"
                                  />
                                  <p style={{ color: "red" }}>
                                    {errors.brand?.message}
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="form-group">
                                  <label>Title</label>
                                  <input
                                    {...register("title")}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="form-control"
                                  />
                                  <p style={{ color: "red" }}>
                                    {errors.title?.message}
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="form-group">
                                  <label>Category</label>
                                  <input
                                    {...register("category")}
                                    value={category}
                                    onChange={(e) =>
                                      setCategory(e.target.value)
                                    }
                                    className="form-control"
                                  />
                                  <p style={{ color: "red" }}>
                                    {errors.category?.message}
                                  </p>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="form-group">
                                  <label>Price</label>
                                  <input
                                    {...register("price")}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="form-control"
                                  />
                                  <p style={{ color: "red" }}>
                                    {errors.price?.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button className="btn btn-success" type="submit">
                    Save
                  </Button>
                  <Button className="btn btn-danger" onClick={handleModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>
          </div>
          {prodata && prodata.length > 0 && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Brand</td>
                  <td>Title</td>
                  <td>Category</td>
                  <td>Price</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {prodata
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.brand}</td>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>{item.price}</td>
                      <td>
                        <a
                          onClick={() => {
                            LoadEdit(item.id);
                          }}
                          className="btn btn-success"
                        >
                          Edit
                        </a>
                        <a
                          onClick={() => {
                            Removefunction(item.id);
                          }}
                          className="btn btn-danger"
                        >
                          Delete
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          <div className="pagination-container">
            <div className="pagination">
              <div>
                <button
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  onClick={() => handleChangePage(page + 1)}
                  disabled={prodata && indexOfLastItem >= prodata.length}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
