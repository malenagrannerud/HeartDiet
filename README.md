# Heart-Healthy Dietary Application

## 🎯 Intended Purpose
The Heart-Healthy Dietary Application is an independent software solution (SaMD) intended to support the management of cardiovascular health by enabling users to track specific dietary metrics and adhere to heart-healthy nutritional regimens (the PREDIMED/10TT protocole). 

* **Intended User Population:** Older adults requiring dietary management related to cardiovascular health.
* **Intended Use Environment:** Home environment / mobile use.
* **Medical Indication:** Support for prevention and management of cardiovascular risks through structured evidence based nutritional tracking.

## 🔒 Regulatory & Security Notice
This app is not deployed, since it is a prototype. However, the codebase is ready to run locally for demonstration and testing.

## Applicable standards
- EN IEC 62304:2006 – Medical device software — Software life cycle processes
- EN ISO 14971:2019 – Medical devices — Application of risk management to medical devices
- EN ISO 13485:2016 – Medical devices — QMS — Requirements for regulatory purposes
- EN IEC 62366-1:2015 – Medical devices — Part 1: Application of usability engineering to medical devices
- EN IEC 82304-1:2016 – Health software — Part 1: General requirements for product safety

## 🚀 How to Run the App (via GitHub Codespaces)
Launch and run the app in your browser using GitHub Codespaces.

### Step-by-Step Instructions:
1. **Launch the Codespace:**
   * At the top of this GitHub repository page, click the green **"Code"** button.
   * Select the **"Codespaces"** tab.
   * Click **"Create codespace on main"**. (This opens a virtual development environment in a new browser tab).
2. **Wait for Initialization:**
   * Wait a few moments for the virtual container to load and set up the dependencies.
3. **Start the Application:**
   * In the terminal at the bottom of the screen, type the following command and press `Enter`:
     ```bash
     npm run dev
     ```
4. **Open the App:**
   * Click the **"Open in Browser"** button in the notification that appears in the bottom-right corner.
   * The app will open in a new tab! Click around, and save some metrics. 

## 🛠️ Tech Stack & Features
Built with TypeScript

## TO DO 

## 📝 TO-DO / Product Roadmap

### 🟩 Phase 1: Prototype & Initial Testing (Current Stage)



## 📊 Design Controls & Traceability Matrix (MDR / ISO 14971 / IEC 62304)

This matrix demonstrates the traceability from User Needs down to Software Requirements, Risk Mitigation, and Verification Methods (including MAUQ protocols), in alignment with medical device software standards.

## 📊 Integrated Traceability & Specifications Matrix (MDR / ISO 14971 / IEC 62304)

This integrated matrix demonstrates 100% end-to-end traceability from User Needs, through system Inputs/Outputs and Hazards, down to the final Verification Methods.



| ID | User Need  | Input Data & Validation | System Output & UI Display | Hazard  | Verification Method | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TM-01** | User needs to easily see and navigate the screen. | **Input:** Device viewport size and system accessibility text settings. | **Output:** High-contrast UI rendering with a minimum 16pt scalable font size. | **Hazard:** User misreads dietary metrics due to poor legibility, leading to incorrect food tracking. | **MAUQ Section 1**<br>(Usability & Interface Design Review) | Pending |

| **TM-02** | User needs to accurately log food intake to manage cardiovascular risks. | **Input:** Calendar view check list. | **Output:** Real time update and daily historical logs. | **Hazard:** System software calculates or displays incorrect totals, causing the user to exceed medical limits. | **Code Verification Test v1.1**<br>(Automated unit testing for core mathematical logic) | Pass (Round 1) |

| **TM-03** | User needs immediate feedback if food interact with medication | **Input:** Meal entry containing active ingredients known to interact with cardiovascular medication. | **Output:** High-priority, high-contrast visual warning modals. | **Hazard:** Alert fatigue or confusing styling causes the elderly user to ignore critical thresholds. | **MAUQ Section 3**<br>(System Usefulness & User Interaction) | Pending |

| **TM-04** | User needs confidence that their data are kept confidential. | **Input:** User profile data (Age, weight, specific cardiovascular targets). | **Output:** Encrypted data stream written to local sandbox storage environment only. | **Hazard:** Data breach or leak of user identity combined with health metrics (GDPR violation). | **Security Protocol Review**<br>(Architecture & data isolation audit) | Pending  |


* [x] Develop core dietary tracking logic and TypeScript frontend
* [x] Conduct initial test round (functional verification of code logic)
* [x] Implement feedback from MAUQ.
* [ ] Develop IFU on paper aswell
* [ ] Exchange text to images as much as possible

### 🟨 Phase 2: Regulatory Alignment (Next Steps)
* [ ] **IEC 62304 Compliance:** Classify software safety level and document software architecture
* [ ] **ISO 14971 Compliance:** Perform a formal hazard analysis 
* [ ] **IEC 62366-1 Usability Testing:** Conduct a usability study with older adult users
* [ ] **Data Privacy:** Implement end-to-end encryption for user health metrics (GDPR / HIPAA)

### 🟦 Phase 3: Validation & Deployment
* [ ] Perform software verification and validation (V&V) testing
* [ ] Establish a QMS aligned with ISO 13485
* [ ] Compile the Technical Documentation 

