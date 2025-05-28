export default function GetHelpBanner() {
  return (
    <div className="bg-red-100 text-red-900 p-4 rounded-xl shadow-md mt-4">
      <h2 className="font-bold text-lg">Need Help?</h2>
      <p>If you’re in crisis, you can contact:</p>
      <ul className="list-disc ml-6 mt-2">
        <li>Samaritans (UK): 116 123</li>
        <li>SHOUT (Text): 85258</li>
        <li><a href="https://www.befrienders.org/" className="underline text-blue-600">Befrienders Worldwide</a></li>
      </ul>
    </div>
  );
}
// This component is a simple banner that provides information on where to get help in case of a crisis.
// It includes a title, a brief message, and a list of resources with contact information.