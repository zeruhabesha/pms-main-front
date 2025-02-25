import React from 'react';

const SuperAdminHelp = () => {
  return (
    <div>
      <h5>Super Admin Guide</h5>
      <p>
        As a Super Admin, you possess the highest level of control and responsibility within the system.
        Your role involves managing administrative access, configuring system-wide settings, and ensuring
        the overall health and security of the application.
      </p>

      <h6>Key Responsibilities:</h6>
      <ul>
        <li>
          <strong>Admin Account Management:</strong> Create, modify, and disable Admin accounts.  Exercise
          care when granting Super Admin privileges.
        </li>
        <li>
          <strong>System Configuration:</strong>  Configure global settings such as email servers, security
          policies, and data backups.
        </li>
        <li>
          <strong>Security Oversight:</strong> Monitor system logs, user activity, and security settings to
          prevent unauthorized access and potential breaches.
        </li>
        <li>
          <strong>Data Management:</strong>  Oversee data backups, restoration procedures, and data retention policies.
        </li>
        <li>
          <strong>User Role and Permissions:</strong>  Define user roles (Admin, Maintainer, Inspector, etc.) and
          assign permissions to each role.
        </li>
        <li>
          <strong>Application Updates and Maintenance:</strong>  Plan and execute application updates, server maintenance,
          and database optimizations.
        </li>
      </ul>

      <h6>Using the System:</h6>

      <ol>
        <li>
          <strong>Admin Account Management:</strong>
          <ul>
            <li>
              <strong>Creating a New Admin Account:</strong>
              <ul>
                <li>
                  Navigate to the "Account" section and select "Admin".
                </li>
                <li>
                  Click the "Add Admin" button.
                </li>
                <li>
                  Enter the Admin's details (name, email, password, role).
                </li>
                <li>
                  Carefully select the appropriate role and permissions for the Admin.
                </li>
                <li>
                  Save the Admin account.
                </li>
              </ul>
            </li>
            <li>
              <strong>Modifying an Existing Admin Account:</strong>
              <ul>
                <li>
                  Go to the "Account" section and select "Admin".
                </li>
                <li>
                  Locate the Admin account you wish to modify.
                </li>
                <li>
                  Click the "Edit" button.
                </li>
                <li>
                  Make the necessary changes (e.g., update permissions, reset password).
                </li>
                <li>
                  Save the changes.
                </li>
              </ul>
            </li>
            <li>
              <strong>Disabling an Admin Account:</strong>
              <ul>
                <li>
                  Go to the "Account" section and select "Admin".
                </li>
                <li>
                  Locate the Admin account you wish to disable.
                </li>
                <li>
                  Click the "Disable" button.
                </li>
                <li>
                  Confirm the action.  Disabling prevents the Admin from logging in.
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>System Configuration:</strong>
          <ul>
            <li>
              <strong>Configuring Email Settings:</strong>
              <ul>
                <li>
                  Navigate to the "Settings" section.
                </li>
                <li>
                  Select "Email Configuration".
                </li>
                <li>
                  Enter the required email server details (SMTP host, port, username, password).
                </li>
                <li>
                  Test the connection to ensure the settings are correct.
                </li>
                <li>
                  Save the email settings.
                </li>
              </ul>
            </li>
            <li>
              <strong>Managing Security Policies:</strong>
              <ul>
                <li>
                  Go to the "Settings" section.
                </li>
                <li>
                  Select "Security Policies".
                </li>
                <li>
                  Configure password complexity requirements, session timeout settings, and other
                  security measures.
                </li>
                <li>
                  Save the security policies.
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Data Management:</strong>
          <ul>
            <li>
              <strong>Performing Data Backups:</strong>
              <ul>
                <li>
                  Navigate to the "Settings" section.
                </li>
                <li>
                  Select "Data Backup".
                </li>
                <li>
                  Initiate a data backup.  This will create a copy of the application database.
                </li>
                <li>
                  Download the backup file and store it in a secure location.
                </li>
              </ul>
            </li>
            <li>
              <strong>Restoring Data from a Backup:</strong>
              <ul>
                <li>
                  Navigate to the "Settings" section.
                </li>
                <li>
                  Select "Data Restore".
                </li>
                <li>
                  Upload the backup file you wish to restore.
                </li>
                <li>
                  Confirm the data restore.  This will overwrite the current database with the
                  data from the backup file.
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ol>

      <h6>Security Best Practices:</h6>
      <ul>
        <li>
          <strong>Strong Passwords:</strong>  Use strong, unique passwords for all Super Admin accounts.
        </li>
        <li>
          <strong>Multi-Factor Authentication (MFA):</strong>  Enable MFA for Super Admin accounts to add an
          extra layer of security.
        </li>
        <li>
          <strong>Regular Security Audits:</strong>  Conduct regular security audits of the system, including
          user permissions, security settings, and system logs.
        </li>
        <li>
          <strong>Stay Updated:</strong>  Keep the application and server software up to date with the latest
          security patches.
        </li>
      </ul>

      <p>
        Your role as a Super Admin is critical to the overall security and stability of the system.
        By following these guidelines, you can ensure a secure and well-managed application environment.
      </p>
    </div>
  );
};

export default SuperAdminHelp;