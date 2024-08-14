import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    category: String,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);

const app = express();
// app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5001;

app.post("/product", async (req, res) => {
    const body = req.body;
    if (
        !body.name ||
        !body.price ||
        !body.category ||
        !body.description
    ) {
        res.status(400).send(`Required parameter missing. Example request body:
        {
            "name": "value",
            "price": "value",
            "category": "value",
            "description": "value"
        }`);
        return;
    }

    try {
        const saved = await productModel.create({
            name: body.name,
            price: body.price,
            category: body.category,
            description: body.description,
        });
        console.log(saved);
        res.send({
            message: "Your product is saved",
            data: saved,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Server error",
        });
    }
});

app.get('/products', async (req, res) => {
    try {
        const data = await productModel.find({})
            .sort({ _id: -1 })
            .exec();

        res.send({
            message: "Here is your product list",
            data: data
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: "Server error"
        });
    }
});

app.get('/product/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const data = await productModel.findOne({ _id: id }).exec();
        if (data) {
            res.send({
                message: "Here is your product",
                data: data
            });
        } else {
            res.status(404).send({
                message: "Product not found",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Server error"
        });
    }
});

app.put('/product/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;

    if (
        !body.name ||
        !body.price ||
        !body.category ||
        !body.description
    ) {
        res.status(400).send(`Required parameter missing. Example request body:
        {
            "name": "value",
            "price": "value",
            "category": "value",
            "description": "value"
        }`);
        return;
    }

    try {
        const data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                category: body.category,
                description: body.description
            },
            { new: true }
        ).exec();

        console.log('Updated:', data);
        res.send({
            message: "Product is updated successfully",
            data: data
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Server error"
        });
    }
});

app.delete('/products', async (req, res) => {
    try {
        await productModel.deleteMany({});
        res.send({
            message: "All Products have been deleted successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Server error"
        });
    }
});

app.delete('/product/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedData = await productModel.deleteOne({ _id: id }).exec();
        console.log("Deleted:", deletedData);
        if (deletedData.deletedCount !== 0) {
            res.send({
                message: "Product has been deleted successfully",
            });
        } else {
            res.send({
                message: "No Product found with this id: " + id,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Server error"
        });
    }
});

app.get('/weather', (req, res) => {
    console.log(`${req.ip} is asking for weather`);

    res.send({
        city: "Karachi",
        temp_c: 26,
        humidity: 72,
        max_temp_c: 31,
        min_temp_c: 19
    });
});

const __dirname = path.resolve();
app.get('/', express.static(path.join(__dirname, "/web/index.html")));
app.use('/', express.static(path.join(__dirname, "/web")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

const dbUri = 'mongodb+srv://user123:user123@cluster0.bbbw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbUri);

// MongoDB connected/disconnected events
mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', () => {
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log("App is terminating");
    mongoose.connection.close(() => {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
