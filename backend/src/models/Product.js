import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        discountPrice: {
            type: Number,
            min: 0
        },

        images: [
            {
                type: String
            }
        ],

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        brand: {
            type: String,
            trim: true
        },

        numReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model('Product', productSchema);