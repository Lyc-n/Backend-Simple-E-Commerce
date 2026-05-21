const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const IS_PROD = process.env.MIDTRANS_IS_PROD === 'true';

console.log('SERVER:', SERVER_KEY);

const MIDTRANS_API_BASE = IS_PROD
    ? 'https://app.midtrans.com'
    : 'https://app.sandbox.midtrans.com';

function makeOrderId() {
    const random = Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase();

    return `CH-${Date.now()}-${random}`;
}

function getCourierData(courier) {
    switch (courier) {
        case 'sicepat':
            return {
                label: 'SiCepat HALU',
                shippingCost: 9000,
            };

        case 'gosend':
            return {
                label: 'GoSend Instant',
                shippingCost: 25000,
            };

        case 'jne':
        default:
            return {
                label: 'JNE Reguler',
                shippingCost: 12000,
            };
    }
}

function getEnabledPayments(payment) {
    if (payment === 'gopay') {
        return ['gopay'];
    }

    return [
        'bca_va',
        'bni_va',
        'bri_va',
        'permata_va',
        'echannel',
        'other_va',
    ];
}

exports.createTransaction = async (req, res) => {
    try {
        const {
            courier = 'jne',
            payment = 'gopay',
        } = req.body || {};

        const subtotal = 55500;

        const {
            label: courierLabel,
            shippingCost,
        } = getCourierData(courier);

        const grossAmount =
            subtotal + shippingCost;

        const orderId = makeOrderId();

        const payload = {
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount,
            },

            item_details: [
                {
                    id: 'CHITATO-BBQ',
                    price: 15000,
                    quantity: 3,
                    name: 'Chitato Beef BBQ',
                },

                {
                    id: 'CHITATO-LITE',
                    price: 10500,
                    quantity: 1,
                    name: 'Chitato Lite Sea Salt',
                },

                {
                    id: 'SHIPPING',
                    price: shippingCost,
                    quantity: 1,
                    name: `Shipping - ${courierLabel}`,
                },
            ],

            customer_details: {
                first_name: 'Customer',
                email: 'customer@example.com',
                phone: '081200000000',
            },

            enabled_payments:
                getEnabledPayments(payment),
        };

        const { data } = await axios.post(
            `${MIDTRANS_API_BASE}/snap/v1/transactions`,
            payload,
            {
                auth: {
                    username: SERVER_KEY,
                    password: '',
                },

                headers: {
                    Accept: 'application/json',
                    'Content-Type':
                        'application/json',
                },
            }
        );

        return res.json({
            token: data.token,
            redirect_url: data.redirect_url,
        });
    } catch (error) {
        console.error(error?.response?.data);

        return res.status(500).json({
            message:
                'Gagal membuat transaksi Midtrans',
            detail:
                error?.response?.data ||
                error.message,
        });
    }
};

exports.handleNotification = async (
    req,
    res
) => {
    console.log(req.body);

    res.sendStatus(200);
};