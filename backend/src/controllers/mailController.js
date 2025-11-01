// Sample mail controller with basic CRUD operations

export const getEmails = async (req, res) => {
  try {
    // TODO: Implement actual email fetching logic
    const emails = [
      {
        id: 1,
        from: 'example@example.com',
        subject: 'Welcome to Gatto Mail',
        body: 'This is a sample email',
        date: new Date().toISOString(),
        read: false,
      },
    ];

    res.status(200).json({
      status: 'success',
      data: {
        emails,
        total: emails.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const getEmailById = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implement actual email fetching logic
    const email = {
      id: parseInt(id),
      from: 'example@example.com',
      subject: 'Sample Email',
      body: 'This is a sample email body',
      date: new Date().toISOString(),
      read: true,
    };

    res.status(200).json({
      status: 'success',
      data: { email },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const sendEmail = async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // TODO: Implement actual email sending logic
    const sentEmail = {
      id: Date.now(),
      to,
      subject,
      body,
      date: new Date().toISOString(),
    };

    res.status(201).json({
      status: 'success',
      message: 'Email sent successfully',
      data: { email: sentEmail },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

export const deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO: Implement actual email deletion logic
    res.status(200).json({
      status: 'success',
      message: `Email ${id} deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
