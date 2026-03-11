const Contact = require('../models/Contact');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        message: 'Please provide name, email, and message'
      });
    }

    // Create new contact message
    const contact = new Contact({
      name,
      email,
      subject: subject || '',
      message
    });

    // Save to MongoDB
    const savedContact = await contact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      data: {
        id: savedContact._id,
        name: savedContact.name,
        email: savedContact.email,
        createdAt: savedContact.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error getting contact messages:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Delete a contact message (admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: 'Message not found'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.'
    });
  }
};
