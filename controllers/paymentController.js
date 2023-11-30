const express = require("express");
const stripe = require("stripe")("Your Secret Key");
const dotenv = require("dotenv");
dotenv.config();

exports.paymentMethod = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res
      .status(200)
      .json({ clientSecret: paymentIntent.process.env.clientSecret });
  } catch (error) {
    res.status(200).json({ error: "Internet Server Error" });
  }
};
