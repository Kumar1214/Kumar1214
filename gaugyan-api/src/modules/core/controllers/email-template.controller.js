const EmailTemplate = require('../EmailTemplate');

// Get all templates
const getTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.findAll({
            order: [['module', 'ASC'], ['name', 'ASC']]
        });
        res.json({ success: true, count: templates.length, data: templates });
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ success: false, message: 'Server error fetching templates' });
    }
};

// Create new template
const createTemplate = async (req, res) => {
    try {
        const { name, slug, module, subject, content, variables } = req.body;

        // Check if slug exists
        const existing = await EmailTemplate.findOne({ where: { slug } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Template with this ID (slug) already exists' });
        }

        const template = await EmailTemplate.create({
            name,
            slug,
            module: module || 'general',
            subject,
            content,
            variables: variables || []
        });

        res.status(201).json({ success: true, data: template });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ success: false, message: 'Server error creating template' });
    }
};

// Update template
const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subject, content, variables, isActive, module } = req.body;

        const template = await EmailTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        await template.update({
            name: name || template.name,
            subject: subject || template.subject,
            content: content || template.content,
            variables: variables || template.variables,
            module: module || template.module,
            isActive: isActive !== undefined ? isActive : template.isActive
        });

        res.json({ success: true, data: template });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ success: false, message: 'Server error updating template' });
    }
};

// Delete template
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await EmailTemplate.findByPk(id);

        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }

        await template.destroy();
        res.json({ success: true, message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ success: false, message: 'Server error deleting template' });
    }
};

// Seed default templates
const seedDefaultTemplates = async () => {
    const defaults = [
        // Authentication
        {
            slug: 'welcome',
            name: 'Welcome Email',
            module: 'auth',
            subject: 'Welcome to Gaugyan World! 🐮',
            content: '<h1>Welcome {{name}}!</h1><p>Thank you for joining Gaugyan World. We are excited to have you on board.</p><p>Explore our courses and marketplace to get started.</p>',
            variables: ['name', 'email']
        },
        {
            slug: 'verify_email',
            name: 'Verify Your Email',
            module: 'auth',
            subject: 'Please Verify Your Email Address',
            content: '<p>Hi {{name}},</p><p>Please click the link below to verify your email address:</p><p><a href="{{link}}">Verify Email</a></p><p>If you did not request this, please ignore this email.</p>',
            variables: ['name', 'link']
        },
        {
            slug: 'reset_password',
            name: 'Reset Password',
            module: 'auth',
            subject: 'Password Reset Request',
            content: '<p>Hi {{name}},</p><p>You requested a password reset. Click the link below to reset your password:</p><p><a href="{{link}}">Reset Password</a></p><p>This link is valid for 30 minutes.</p>',
            variables: ['name', 'link']
        },
        {
            slug: 'password_changed',
            name: 'Password Changed Notification',
            module: 'auth',
            subject: 'Your Password Was Changed',
            content: '<p>Hi {{name}},</p><p>Your password was successfully changed. If this wasn\'t you, please contact support immediately.</p>',
            variables: ['name']
        },

        // E-Commerce
        {
            slug: 'order_confirmation',
            name: 'Order Confirmation',
            module: 'ecommerce',
            subject: 'Order #{{orderId}} Confirmed',
            content: '<h1>Order Confirmed</h1><p>Hi {{name}}, thank you for your order!</p><p><strong>Order ID:</strong> #{{orderId}}</p><p><strong>Total:</strong> {{amount}}</p><p>We will notify you once your items are shipped.</p>',
            variables: ['name', 'orderId', 'amount', 'items']
        },
        {
            slug: 'order_shipped',
            name: 'Order Shipped',
            module: 'ecommerce',
            subject: 'Your Order #{{orderId}} has shipped!',
            content: '<h1>Great News!</h1><p>Your order #{{orderId}} has been shipped.</p><p><strong>Tracking Number:</strong> {{trackingNumber}}</p><p>Track your package <a href="{{trackingLink}}">here</a>.</p>',
            variables: ['name', 'orderId', 'trackingNumber', 'trackingLink']
        },
        {
            slug: 'order_delivered',
            name: 'Order Delivered',
            module: 'ecommerce',
            subject: 'Your Order #{{orderId}} has been delivered',
            content: '<p>Hi {{name}},</p><p>Your order #{{orderId}} has been marked as delivered. We hope you enjoy your purchase!</p>',
            variables: ['name', 'orderId']
        },
        {
            slug: 'order_cancelled',
            name: 'Order Cancelled',
            module: 'ecommerce',
            subject: 'Order #{{orderId}} Cancelled',
            content: '<p>Hi {{name}},</p><p>Your order #{{orderId}} has been cancelled as requested.</p>',
            variables: ['name', 'orderId']
        },

        // Courses / LMS
        {
            slug: 'course_enrollment',
            name: 'Course Enrollment Success',
            module: 'education',
            subject: 'You have enrolled in {{courseName}}',
            content: '<h1>Welcome to the Course!</h1><p>Hi {{name}}, you have successfully enrolled in <strong>{{courseName}}</strong>.</p><p><a href="{{courseLink}}">Start Learning Now</a></p>',
            variables: ['name', 'courseName', 'courseLink']
        },
        {
            slug: 'course_completed',
            name: 'Course Completion',
            module: 'education',
            subject: 'Congratulations on completing {{courseName}}!',
            content: '<h1>Congratulations! 🎉</h1><p>Hi {{name}}, you have successfully completed <strong>{{courseName}}</strong>.</p><p>Your certificate is now available for download.</p>',
            variables: ['name', 'courseName', 'certificateLink']
        },
        {
            slug: 'new_assignment',
            name: 'New Assignment Posted',
            module: 'education',
            subject: 'New Assignment in {{courseName}}',
            content: '<p>Hi {{name}}, a new assignment <strong>{{assignmentTitle}}</strong> has been posted in {{courseName}}.</p><p>Due Date: {{dueDate}}</p>',
            variables: ['name', 'courseName', 'assignmentTitle', 'dueDate']
        },
        {
            slug: 'instructor_student_enrolled',
            name: 'New Student Enrolled (Instructor)',
            module: 'education',
            subject: 'New Student Enrolled in {{courseName}}',
            content: '<p>Hi Instructor,</p><p>A new student, {{studentName}}, has enrolled in your course <strong>{{courseName}}</strong>.</p>',
            variables: ['studentName', 'courseName']
        },

        // Admin / Notifications
        {
            slug: 'new_user_alert',
            name: 'New User Registration (Admin)',
            module: 'admin',
            subject: 'New User Registered: {{name}}',
            content: '<p>Admin Alert:</p><p>A new user <strong>{{name}}</strong> ({{email}}) has registered on the platform.</p>',
            variables: ['name', 'email']
        },
        {
            slug: 'new_order_alert',
            name: 'New Order Received (Admin)',
            module: 'admin',
            subject: 'New Order #{{orderId}} Received',
            content: '<p>Admin Alert:</p><p>New order received for {{amount}}.</p><p>Order ID: #{{orderId}}</p>',
            variables: ['orderId', 'amount']
        },
        {
            slug: 'gaushala_application',
            name: 'New Gaushala Application',
            module: 'admin',
            subject: 'New Gaushala Application: {{gaushalaName}}',
            content: '<p>A new Gaushala application has been submitted by {{applicantName}}.</p><p>Name: {{gaushalaName}}</p><p>Please review it in the admin dashboard.</p>',
            variables: ['applicantName', 'gaushalaName']
        },

        // Partners / Gaushalas
        {
            slug: 'gaushala_registration_confirmation',
            name: 'Gaushala Registration Received',
            module: 'partners',
            subject: 'We received your Gaushala Application',
            content: '<h1>Registration Received</h1><p>Namaste {{name}}, we have received your request to register <strong>{{gaushalaName}}</strong>.</p><p>Our team will verify the details and get back to you shortly.</p>',
            variables: ['name', 'gaushalaName']
        },
        {
            slug: 'donation_received',
            name: 'Donation Received',
            module: 'partners',
            subject: 'Thank you for your donation to {{gaushalaName}}',
            content: '<h1>Thank You!</h1><p>Hi {{donorName}}, thank you for your generous donation of {{amount}} to {{gaushalaName}}.</p><p>Your support helps us care for the cows.</p>',
            variables: ['donorName', 'amount', 'gaushalaName']
        }
    ];

    for (const t of defaults) {
        const exists = await EmailTemplate.findOne({ where: { slug: t.slug } });
        if (!exists) {
            await EmailTemplate.create(t);
            console.log(`Seeded email template: ${t.name}`);
        }
    }
};

// Expose seed function to be called on server start if needed
// or just verified via an endpoint
const checkAndSeed = async (req, res) => {
    await seedDefaultTemplates();
    res.json({ success: true, message: 'Templates seeded' });
};

module.exports = {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    checkAndSeed,
    seedDefaultTemplates
};
