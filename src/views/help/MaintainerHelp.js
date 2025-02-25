import React from 'react';

const MaintainerHelp = () => {
  return (
    <div>
      <h5>Maintainer Guide</h5>
      <p>
        As a Maintainer, your primary responsibility is to address and resolve maintenance requests
        efficiently. This guide provides detailed instructions on how to use the system effectively
        to manage your assigned tasks.
      </p>

      <h6>Key Responsibilities:</h6>
      <ul>
        <li>
          <strong>Reviewing Assigned Maintenance Requests:</strong>  Access and understand the details of your
          assigned maintenance tasks.
        </li>
        <li>
          <strong>Updating Maintenance Request Status:</strong>  Keep the system updated with the current status
          of each task.
        </li>
        <li>
          <strong>Documenting Work Performed:</strong>  Provide clear and concise notes on the work you have
          completed.
        </li>
        <li>
          <strong>Managing Profile Information:</strong> Keep your contact details current.
        </li>
      </ul>

      <h6>Using the System:</h6>

      <ol>
        <li>
          <strong>Reviewing Assigned Maintenance Requests:</strong>
          <ul>
            <li>
              <strong>Accessing the Maintenance Section:</strong>
              <ul>
                <li>
                  Navigate to the "Maintenance" section.
                </li>
                <li>
                  View the list of maintenance requests assigned to you.
                </li>
              </ul>
            </li>
            <li>
              <strong>Understanding Request Details:</strong>
              <ul>
                <li>
                  Click on a specific request to view its details, including the description of the
                  problem, location, and any attached images.
                </li>
                <li>
                  Carefully review all details to ensure you understand the task requirements.
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Updating Maintenance Request Status:</strong>
          <ul>
            <li>
              <strong>Changing the Status:</strong>
              <ul>
                <li>
                  Within the maintenance request details, select the appropriate status from the available
                  options (e.g., "In Progress," "Completed," "On Hold," "Needs Parts").
                </li>
                 <li>
                  If selecting "On Hold" or "Needs Parts," provide a clear explanation for the delay.
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Documenting Work Performed:</strong>
          <ul>
            <li>
              <strong>Adding Notes:</strong>
              <ul>
                <li>
                  In the maintenance request details, locate the "Notes" or "Comments" section.
                </li>
                <li>
                  Provide a detailed description of the work you have performed.  Be specific and clear.
                </li>
                <li>
                  Include any relevant information, such as materials used, time spent, and any
                  challenges encountered.
                </li>
                <li>
                  Save your notes.
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <strong>Updating Profile Information:</strong>
          <ul>
            <li>
              <strong>Accessing Your Profile:</strong>
              <ul>
                <li>
                  Click on your profile icon or name in the top right corner.
                </li>
                <li>
                  Select "Profile."
                </li>
              </ul>
            </li>
            <li>
              <strong>Editing Your Profile:</strong>
              <ul>
                <li>
                  Make any necessary changes (e.g., contact information).
                </li>
                <li>
                  Save your updates.
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ol>

      <h6>Best Practices for Maintainers:</h6>
      <ul>
        <li>
          <strong>Prioritize Tasks:</strong>  Address maintenance requests based on their priority and
          urgency.
        </li>
        <li>
          <strong>Communicate Effectively:</strong>  If you encounter any problems or delays, communicate them
          to the property manager promptly.
        </li>
        <li>
          <strong>Document Thoroughly:</strong> Provide detailed notes on all work performed to ensure a
          clear record of the maintenance history.
        </li>
      </ul>

      <p>
        By following these guidelines, you can effectively manage your assigned maintenance tasks and
        contribute to maintaining high-quality living conditions for tenants.
      </p>
    </div>
  );
};

export default MaintainerHelp;