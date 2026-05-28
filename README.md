# Heart-Healthy Dietary Application


## 🎯 Intended Purpose Statement (MDR Context)
The Heart-Healthy Dietary Application is an independent software solution (SaMD) intended to support the management of cardiovascular health by enabling users to track specific dietary metrics and adhere to heart-healthy nutritional regimens. 

* **Intended User Population:** Older adults (geriatric population) requiring dietary management related to cardiovascular health.
* **Intended Use Environment:** Home environment / mobile use.
* **Medical Indication:** Support for prevention and management of cardiovascular risks through structured nutritional tracking.

## 🔒 Regulatory & Security Notice
This app is not deployed, since it is a prototype. However, the codebase is ready to run locally for demonstration and testing.

## Applicable standards

- EN IEC 62304:2006 – Medical device software — Software life cycle processes
- EN ISO 14971:2019 – Medical devices — Application of risk management to medical devices
- EN ISO 13485:2016 – Medical devices — QMS — Requirements for regulatory purposes
- EN IEC 62366-1:2015 – Medical devices — Part 1: Application of usability engineering to medical devices
- EN IEC 82304-1:2016 – Health software — Part 1: General requirements for product safety




## 🚀 How to Run the App (via GitHub Codespaces)
You can launch and run the app directly in your browser using GitHub Codespaces.

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
   * The app will open in a new tab! Click around, and try save some metrics. 

## 🛠️ Tech Stack & Features
Built with TypeScript

## TO DO 

## 📝 TO-DO / Product Roadmap

### 🟩 Phase 1: Prototype & Initial Testing (Current Stage)
* [x] Develop core dietary tracking logic and TypeScript frontend
* [x] Conduct initial test round (functional verification of code logic)
* [x] Implement feedback from MAUQ tests nr 2. 

### 🟨 Phase 2: Regulatory Alignment (Next Steps)
* [ ] **IEC 62304 Compliance:** Classify software safety level and document software architecture
* [ ] **ISO 14971 Compliance:** Perform a formal hazard analysis 
* [ ] **IEC 62366-1 Usability Testing:** Conduct a usability study with older adult users
* [ ] **Data Privacy:** Implement end-to-end encryption for user health metrics (GDPR / HIPAA)

### 🟦 Phase 3: Validation & Deployment
* [ ] Perform software verification and validation (V&V) testing
* [ ] Compile the Technical Documentation for EU MDR submission
* [ ] Establish a Quality Management System (QMS) aligned with ISO 13485


